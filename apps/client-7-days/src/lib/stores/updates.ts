import { addRandom } from '$lib/utils';
import type { DBInstance, DBUpdate } from './db';
import { moodleClient } from './token';
import pQueue from 'p-queue';
import { writable, type Readable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import { cubicInOut } from 'svelte/easing';

export async function updateCourse(db: DBInstance, token: string, courseid: number) {
	const course = await db.get('courses', courseid);
	const now = new Date();
	if (course && course.nextUpdateAt < now) {
		const moodle = moodleClient(token);
		const updates = await moodle.getUpdatesSince(courseid, course.nextUpdateAt);
		const dbUpdates: DBUpdate[] = [];
		const promises = updates.map(async (update) => {
			const dbUpdate = { data: update, courseid, since: course.nextUpdateAt, until: now };
			dbUpdates.push(dbUpdate);
			await db.put('updates', dbUpdate);
		});
		await Promise.all(promises);
		await db.put('courses', {
			...course,
			nextUpdateAt: addRandom(now, { hours: 1 }, { hours: 3 })
		});
		return dbUpdates;
	}
	return [];
}

export function updateCourses(
	db: DBInstance,
	token: string
): { current: Readable<number>; total: Readable<number>; updates: Readable<DBUpdate[]> } {
	const total$ = writable(0);
	const updates$ = writable<DBUpdate[]>([]);
	const current$ = tweened(0, { easing: cubicInOut, duration: 1000 });
	db.transaction('courses')
		.store.getAllKeys()
		.then((courseids) => {
			total$.set(courseids.length);
			const queue = new pQueue({ concurrency: 8, interval: 1000 });
			for (const courseid of courseids) {
				queue
					.add(() => updateCourse(db, token, courseid))
					.then((dbUpdates) => {
						current$.update(($current) => $current + 1);
						updates$.update(($updates) => {
							$updates.push(...dbUpdates);
							return $updates;
						});
					});
			}
		});
	return { current: current$, total: total$, updates: updates$ };
}
