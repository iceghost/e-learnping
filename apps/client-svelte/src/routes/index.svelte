<script lang="ts">
    import * as moodle from 'moodle';
    import PQueue from 'p-queue';
    import { session } from '$app/stores';
    import { getSemester, parseCategory, parseCourseName } from '$lib/parse';
    import Logo from '$lib/Logo.svelte';
    import { each } from 'svelte/internal';
    import { categories, updateCategory } from '$lib/stores/category';
    import { courses } from '$lib/stores/course';

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

            await tx.store.put({
                course,
                nameParts,
                updatedAt: oldCourse?.updatedAt || new Date(0),
                hidden: oldCourse?.hidden ?? false,
            });
            await tx.done;

            const semester = getSemester(course.coursecategory);
            const { name, translation } = parseCategory(course.coursecategory);

            const oldCategory = await $session.db.get(
                'categories',
                course.coursecategory
            );
            $session.db.put('categories', {
                coursecategory: course.coursecategory,
                name,
                translation,
                semester,
                hidden: oldCategory?.hidden ?? false,
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

    let editMode = false;
</script>

<div class="h-screen w-full flex items-center justify-center sm:justify-start">
    <div class="sm:mx-16 h-full sm:max-h-[calc(100vh-2rem)] flex flex-col">
        <div class="z-20 bg-slate-100 rounded-md flex py-2 px-4 shadow-md">
            <Logo />
        </div>
        <div
            class="relative z-10 -mt-2 pt-4 sm:mt-4 overflow-scroll bg-slate-50 px-5 rounded-md"
        >
            <button on:click={updateCourses}>Get courses</button>
            <button on:click={updateGroups}>Get groups</button>
            <button on:click={updateContents}>Get contents</button>

            {#each $categories as { hidden, coursecategory, name }}
                {#if !hidden || editMode}
                    <h3
                        class="font-bold text-sky-800 py-0.5 px-2 mt-3 mb-1 border-b-2 border-slate-300 bg-slate-100"
                    >
                        {#if editMode}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!hidden}
                                    on:click={(e) => {
                                        updateCategory(
                                            coursecategory,
                                            !e.currentTarget.checked
                                        );
                                        hidden = !e.currentTarget.checked;
                                    }}
                                />
                                {@html name}
                            </label>
                        {:else}
                            {@html name}
                        {/if}
                    </h3>
                {/if}
                {#if !editMode && !hidden && $courses[coursecategory]}
                    <ul class="space-y-2">
                        {#each $courses[coursecategory] as { course, nameParts: { class: c, code, name, semester } }}
                            <li>
                                <p class="underline decoration-slate-300 underline-offset-1">
                                    <a href="/course/{course.id}"
                                        >{@html name}</a
                                    >
                                </p>
                                {#if code && c}
                                    <p class="uppercase text-xs text-sky-600">
                                        {code} · {c}
                                    </p>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
            {/each}

            <div class="sticky bottom-5 flex justify-end pointer-events-none">
                <button
                    class="w-12 h-12 bg-sky-600 shadow-lg flex items-center justify-center text-white rounded-full pointer-events-auto"
                    title="Ẩn những môn không cần thiết"
                    on:click={() => (editMode = !editMode)}
                >
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
