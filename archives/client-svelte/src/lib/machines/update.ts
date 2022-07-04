import type { DBInstance, MyDB } from '$lib/db';
import { getSemester, parseCategory, parseCourseName } from '$lib/parse';
import { addRandom } from '$lib/random_time';
import type { IDBPCursorWithValueIteratorValue } from 'idb';
import type * as moodle from 'moodle';
import PQueue from 'p-queue';

export async function update(client: moodle.Client, db: DBInstance) {
    const now = new Date();
    const queue = new PQueue({
        concurrency: 8,
        intervalCap: 8,
        interval: 1000,
    });

    await refreshCourses();
    await checkUpdates();
    await queue.onIdle();

    async function refreshCourses() {
        const expectedMillis = parseInt(
            (await db.get('kv', 'nextListRefreshAt')) || '0'
        );
        if (Date.now() > expectedMillis) {
            // the time hath come
            const courses = await client.getCourses();
            await Promise.all(courses.map(persistCourse));

            // reset time
            await db.put('kv', now.getTime().toString(), 'coursesRefreshedAt');
            await db.put(
                'kv',
                addRandom(now, { days: 7 }).getTime().toString(),
                'nextListRefreshAt'
            );
        }
    }

    async function checkUpdates() {
        for await (const cursor of db.transaction('courses', 'readwrite')
            .store) {
            const course = structuredClone(cursor.value);
            if (now.getTime() > course.nextRefreshAt.getTime()) {
                // the time hath come
                queue.add(update).then(async (updates) => {
                    await Promise.all(
                        updates.map((update) => persistUpdate(update, course))
                    );
                    await db.put('courses', {
                        ...course,
                        refreshedAt: now,
                        nextRefreshAt: addRandom(now, { hours: 1 }),
                    });
                });
                queue.add(content).then(async (sections) => {
                    await Promise.all(
                        sections.map((section) =>
                            persistSection(section, course)
                        )
                    );
                });

                async function update() {
                    const updates = await client.getUpdatesSince(
                        course.course.id,
                        course.refreshedAt
                    );
                    return updates;
                }

                async function content() {
                    const sections = await client.getContents(course.course.id);
                    return sections;
                }
            }
        }
    }

    async function persistSection(
        section: moodle.Section,
        // prettier-ignore
        course: MyDB['courses']['value']
    ) {
        const moduleTx = db.transaction('modules', 'readwrite');

        const promises = section.modules.map(async (module) => {
            await moduleTx.store.put({
                module,
                sectionid: section.id,
            });
        });

        promises.push(moduleTx.done);

        await Promise.all(promises);

        await db.put('sections', {
            section: { ...section, modules: [] },
            courseid: course.course.id,
        });
    }

    async function persistUpdate(
        update: moodle.Update,
        // prettier-ignore
        course: MyDB['courses']['value']
    ) {
        await db.put('updates', {
            update,
            courseid: course.course.id,
            since: course.refreshedAt,
            until: now,
            read: false,
        });
    }

    async function persistCourse(course: moodle.Course) {
        // update course database
        const tx = db.transaction('courses', 'readwrite');
        let oldCourse = await tx.store.get(course.id);
        await tx.store.put({
            course,
            nameParts: parseCourseName(course.fullname),
            // careful not to overwrite
            refreshedAt: oldCourse?.refreshedAt || new Date(0),
            nextRefreshAt: oldCourse?.nextRefreshAt || new Date(0),
            hidden: oldCourse?.hidden ?? false,
        });
        await tx.done;

        // update categories database
        const tx2 = db.transaction('categories', 'readwrite');
        const oldCategory = await tx2.store.get(course.coursecategory);
        await tx2.store.put({
            coursecategory: course.coursecategory,
            semester: getSemester(course.coursecategory),
            hidden: oldCategory?.hidden ?? false,
            // {name, translation}
            ...parseCategory(course.coursecategory),
        });
        await tx2.done;
    }
}
