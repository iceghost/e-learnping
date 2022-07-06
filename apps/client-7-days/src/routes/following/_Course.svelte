<script lang="ts">
	import { parseCourseName } from '$lib/parsers';
	import type { DBCourse } from '$lib/stores/db';
	import { page } from '$app/stores';

	export let course: DBCourse;

	$: parts = parseCourseName(course.data.fullname);
</script>

<li class="flex items-center justify-between py-4">
	<p class="flex-grow leading-tight">
		<a
			href="/course/{course.data.id}"
			class="font-functional font-medium text-slate-800 underline decoration-sky-300 decoration-1 underline-offset-1 hover:bg-sky-50"
			style:text-decoration-skip-ink="none"
		>
			{@html parts.name}
		</a>
		{#if parts.code}
			<br />
			<span class="text-xs uppercase tracking-wide text-sky-700">
				{parts.code} · {parts.class}
			</span>
		{/if}
	</p>
	<div class="flex w-32 flex-none justify-end">
		<button
			class="rounded-full border-2 px-2 py-2 font-functional text-sm font-medium
			{course.following
				? 'border-sky-500 bg-sky-500 text-sky-50 shadow shadow-sky-700/30'
				: 'border-slate-100 text-slate-400 hover:border-sky-200 hover:text-sky-700'}"
			on:click={async () => {
				course.following = !course.following;
				await $page.stuff.db.put('courses', course);
			}}
		>
			{course.following ? 'Bỏ theo dõi' : 'Theo dõi'}
		</button>
	</div>
</li>
