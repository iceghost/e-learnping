import { addRandom, type ResourceState } from '$lib/utils';
import { Client } from 'moodle';
import { writable, type Readable } from 'svelte/store';
import { dbPromise, type DBCourse } from './db';
import { tokenPromise } from './token';

function createCoursesStore(): [Readable<DBCourse[]>, Readable<ResourceState>] {
	const data = writable<DBCourse[]>([]);
	const state = writable<ResourceState>('initial');

	tokenPromise.then(async (token) => {
		if (!token) return;
		const db = await dbPromise;
		const nextCoursesRefresh: Date = (await db.get('kv', 'nextCoursesRefresh')) ?? new Date(0);

		data.set(await db.getAll('courses'));

		if (new Date() > nextCoursesRefresh) {
			state.set('stale');
			const moodle = new Client(token);
			const courses = await moodle.getCourses();
			await Promise.all(
				courses.map(async (course) => {
					const oldCourse = await db.get('courses', course.id);
					await db.put('courses', { data: course, following: oldCourse?.following ?? false });
				})
			);
			data.set(await db.getAll('courses'));
			await db.put('kv', addRandom(new Date(), { days: 7 }), 'nextCoursesRefresh');
		}

		state.set('fresh');
	});

	return [data, state];
}

export const [data, state] = createCoursesStore();
