<script context="module" lang="ts">
	import { dbPromise, type DBCourse } from '$lib/stores/db';
	import { browser } from '$app/env';
	import type { DBContent } from '$lib/stores/db';

	export const load: import('./__types/[courseid]').Load = async ({ params }) => {
		if (!browser) return {};

		const db = await dbPromise;
		const courseid = parseInt(params.courseid);
		const course = await db.get('courses', courseid);
		if (!course) return { status: 404 };

		let content = await db.get('contents', courseid);
		if (!content || new Date() > content.expiresAt) {
			// fetch fresh content
			const token = await tokenPromise;
			if (!token) return {};
			const moodle = moodleClient(token);
			const data = await moodle.getContents(courseid);
			content = {
				data: data.map((section) => ({
					...section,
					modules: section.modules.map(({ id }) => ({ id }))
				})),
				courseid,
				expiresAt: addRandom(new Date(), { days: 5 }, { days: 9 })
			};
			db.put('contents', content);
			await Promise.all(
				data.map(
					async (section) =>
						await Promise.all(section.modules.map((module) => db.put('modules', { data: module })))
				)
			);
		}

		return {
			props: {
				course,
				content
			}
		};
	};
</script>

<script lang="ts">
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Module from './_Module.svelte';
	import { parseCourseName } from '$lib/parsers';
	import { moodleClient, tokenPromise } from '$lib/stores/token';
	import { addRandom } from '$lib/utils';

	export let course: DBCourse;
	export let content: DBContent;
</script>

<div class="mx-auto w-full max-w-sm">
	{#if browser}
		{@const parts = parseCourseName(course.data.fullname)}
		<PageHeading>{parts.name}</PageHeading>
		<p>{parts.class}</p>
		{#each content.data as section}
			<details open>
				<summary
					class="mt-6 mb-3 border-b-2 border-slate-300 bg-slate-100 px-2 py-1 font-bold text-sky-800"
				>
					{@html section.name}
				</summary>
				<div class="space-y-4">
					{#each section.modules as module}
						<Module id={module.id} />
					{/each}
				</div>
			</details>
		{/each}
	{/if}
</div>
