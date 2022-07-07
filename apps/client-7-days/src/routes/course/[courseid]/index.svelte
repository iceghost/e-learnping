<script context="module" lang="ts">
	export const load: import('./__types/index').Load = async ({ stuff }) => {
		if (!stuff.token) return {};

		return {
			props: {
				course: stuff.course,
				content: stuff.content,
				updates: stuff.updates
			}
		};
	};
</script>

<script lang="ts">
	import type { DBContent, DBCourse, DBUpdate } from '$lib/stores/db';
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Module from './_Module.svelte';
	import { parseCourseName } from '$lib/parsers';

	export let course: Promise<DBCourse> = Promise.race([]);
	export let content: Promise<DBContent> = Promise.race([]);
	export let updates: Promise<DBUpdate[]> = Promise.race([]);
</script>

<div class="mx-auto w-full max-w-sm">
	{#await Promise.all([course, content, updates]) then [course, content, updates]}
		{@const parts = parseCourseName(course.data.fullname)}
		<PageHeading title={parts.name}>
			<p class="text-sky-50 font-medium text-sm mt-1">{parts.code} — {parts.class}</p>
		</PageHeading>
		{#each content.data as section}
			<details open>
				<summary class="mt-6 mb-3 font-display px-2 py-1 font-bold text-slate-700">
					{@html section.name}
				</summary>
				<div class="space-y-5">
					{#each section.modules as module}
						<Module id={module.id} />
					{/each}
				</div>
			</details>
		{/each}
	{/await}
</div>
