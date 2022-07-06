import { addRandom } from '$lib/utils';
import type { DBContent, DBInstance } from './db';
import { moodleClient } from './token';

/**
 * Refresh stale contents or on demand
 * @param courseid
 * @param forced used in case of a new update
 * @returns
 */
export async function refreshContent(
	db: DBInstance,
	token: string,
	courseid: number,
	forced = false
): Promise<DBContent> {
	let content = await db.get('contents', courseid);
	if (forced || !content || new Date() > content.expiresAt) {
		// fetch fresh content

		const moodle = moodleClient(token!);
		const fresh = await moodle.getContents(courseid);

		content = {
			data: fresh.map((section) => ({
				...section,
				// only keep the module id in each section
				modules: section.modules.map(({ id }) => ({ id }))
			})),
			courseid,
			expiresAt: addRandom(new Date(), { days: 5 }, { days: 9 })
		};
		await db.put('contents', content);

		const promises = fresh
			.map((section) => section.modules)
			.flat() // for readability, worth it?
			.map((module) => db.put('modules', { data: module }));
		await Promise.all(promises);
	}

	return content;
}
