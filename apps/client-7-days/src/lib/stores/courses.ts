import { addRandom, type ResourceState } from '$lib/utils';
import { writable, type Readable } from 'svelte/store';
import { dbPromise, type DBCourse } from './db';
import { moodleClient, tokenPromise } from './token';

function createCoursesStore(): [
	Readable<DBCourse[]>,
	Readable<ResourceState> & { refresh(): void }
] {
	const data = writable<DBCourse[]>([]);
	const state = writable<ResourceState>('initial');

	tokenPromise.then(async (token) => {
		if (!token) return;
		const db = await dbPromise;
		const coursesExpiresAt: Date = (await db.get('kv', 'coursesExpiresAt')) ?? new Date(0);

		data.set(await db.getAll('courses'));

		if (new Date() > coursesExpiresAt) {
			state.set('stale');
		} else {
			state.set('fresh');
		}
	});

	state.subscribe(async ($state) => {
		const token = await tokenPromise;
		if (token && $state === 'stale') {
			const moodle = moodleClient(token);
			const db = await dbPromise;
			const courses = await moodle.getCourses();
			await Promise.all(
				courses.map(async (course) => {
					const oldCourse = await db.get('courses', course.id);
					await db.put('courses', { data: course, following: oldCourse?.following ?? true });
				})
			);
			data.set(await db.getAll('courses'));
			await db.put('kv', addRandom(new Date(), { days: 5 }, { days: 9 }), 'coursesExpiresAt');
			state.set('fresh');
		}
	});

	return [data, { ...state, refresh: () => state.set('stale') }];
}

export const [data, state] = createCoursesStore();
