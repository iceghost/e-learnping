<script lang="ts">
    import CourseName from './_CourseName.svelte';

    import { BASE, post } from '$lib/api';
    import { onMount } from 'svelte';
    import { VAPID_PUBLIC_KEY } from 'vapid-keys';
    import * as moodle from 'moodle';
    import PQueue from 'p-queue';
    import { session } from '$app/stores';
    import { getSemester, parseCategory, parseCourseName } from '$lib/parse';

    const queue = new PQueue({
        concurrency: 8,
        intervalCap: 8,
        interval: 1000,
    });

    const client = new moodle.Client($session.token);

    async function updateCourses() {
        const courses = await client.getEnrolledCourses(
            moodle.Classification.INPROGRESS
        );

        const promises = courses.map(async (course) => {
            const tx = $session.db.transaction('courses', 'readwrite');

            const nameParts = parseCourseName(course.fullname);

            // don't overwrite updateAt field
            let oldCourse = await tx.store.get(course.id);
            let updatedAt = oldCourse?.updatedAt || new Date(0);

            await tx.store.put({ course, nameParts, updatedAt });
            await tx.done;

            const semester = getSemester(course.coursecategory);
            const { name, translation } = parseCategory(course.coursecategory);
            $session.db.put('categories', {
                coursecategory: course.coursecategory,
                name,
                translation,
                semester,
            });
        });

        await Promise.all(promises);

        return courses;
    }

    async function updateGroups() {
        const groups = await client.getGroups();

        const tx = $session.db.transaction('groups', 'readwrite');

        const promises = groups.map(async (group) => {
            await tx.store.put({ group });
        });
        promises.push(tx.done);
        await Promise.all(promises);
    }

    async function updateContents() {
        const courseids = await $session.db.getAllKeys('courses');

        await Promise.all(
            courseids.map(async (courseid) => {
                const sections = await queue.add(() =>
                    client.getContents(courseid)
                );

                const promises = sections.map(async (section) => {
                    const moduleTx = $session.db.transaction(
                        'modules',
                        'readwrite'
                    );

                    const promises = section.modules.map(async (module) => {
                        await moduleTx.store.put({
                            module,
                            sectionid: section.id,
                        });
                    });

                    promises.push(moduleTx.done);

                    await Promise.all(promises);

                    await $session.db.put('sections', {
                        section: { ...section, modules: [] },
                        courseid,
                    });
                });

                return Promise.all(promises);
            })
        );
    }

    const categoriesLoader = async () => {
        const begin = new Date();
        let cursor = await $session.db
            .transaction('courses')
            .store.index('by-semester-and-code')
            .openCursor(null, 'prev');
        let prevCategory: string | undefined = undefined;
        const results: { category: string; courses: moodle.Course[] }[] = [];
        while (cursor) {
            const category = cursor.value.course.coursecategory;
            if (prevCategory !== category) {
                results.push({
                    category,
                    courses: [],
                });
                prevCategory = category;
            }
            results.at(-1)?.courses.push(cursor.value.course);
            cursor = await cursor.continue();
        }
        console.log(Date.now() - begin.getTime());
        return results;
    };
</script>

<button on:click={updateCourses}>Get courses</button>
<button on:click={updateGroups}>Get groups</button>
<button on:click={updateContents}>Get contents</button>

{#await categoriesLoader() then categories}
    {#each categories as { category, courses }}
        <p>{category}</p>
        <ul>
            {#each courses as course}
                <li>
                    <CourseName {course} />
                </li>
            {/each}
        </ul>
    {/each}
{/await}
