<script context="module" lang="ts">
	export const load: import('./__types/index').Load = async ({ stuff }) => {
		if (!stuff.token) return {};

		return {
			props: {
				course: stuff.course,
				content: stuff.content
			}
		};
	};
</script>

<script lang="ts">
	import type { DBContent, DBCourse } from '$lib/stores/db';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Module from './_Module.svelte';
	import { parseCourseName } from '$lib/parsers';

	export let course: Promise<DBCourse> = Promise.race([]);
	export let content: Promise<DBContent> = Promise.race([]);
</script>

<div class="mx-auto w-full max-w-sm">
	{#await Promise.all([course, content]) then [course, content]}
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
	{/await}
</div>
