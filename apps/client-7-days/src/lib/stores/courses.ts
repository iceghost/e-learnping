import { getSemester, parseCategory, parseCourseName } from '$lib/parsers';
import { addRandom, groupBy } from '$lib/utils';
import type { DBCourse, DBInstance } from './db';
import { moodleClient } from './token';

export async function refreshCourses(
	db: DBInstance,
	token: string,
	options: { forced: boolean } = { forced: true }
) {
	const coursesExpiresAt: Date | undefined = await db.get('kv', 'coursesExpiresAt');
	if (options.forced || !coursesExpiresAt || new Date() > coursesExpiresAt) {
		const moodle = moodleClient(token);

		// if first time, unfollow all
		// on subsequent times, auto follow
		const count = await db.count('courses');

		const courses = await moodle.getCourses();
		const promises = courses.map(async (course) => {
			const oldCourse = await db.get('courses', course.id);
			await db.put('courses', { data: course, following: oldCourse?.following ?? count != 0 });
		});

		await Promise.all(promises);
		await db.put('kv', addRandom(new Date(), { days: 5 }, { days: 9 }), 'coursesExpiresAt');
	}

	return await db.getAll('courses');
}

export function process(courses: DBCourse[], search = '') {
	const filtered = courses.filter((course) =>
		course.data.fullname.toLocaleLowerCase().includes(search)
	);

	const parsed = filtered
		.map((course) => ({
			...course,
			parts: parseCourseName(course.data.fullname)
		}))
		.sort((a, b) => a.parts.code.localeCompare(b.parts.code));

	const processed = Array.from(groupBy(parsed, (course) => course.data.coursecategory).entries())
		.map((tup) => [{ ...parseCategory(tup[0]), semester: getSemester(tup[0]) }, tup[1]] as const)
		.sort((a, b) => -a[0].semester + b[0].semester);

	return processed;
}
