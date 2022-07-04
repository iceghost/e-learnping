<script lang="ts">
	import { parseCourseName } from '$lib/parsers';
	import { dbPromise, type DBCourse } from '$lib/stores/db';

	export let course: DBCourse;

	$: parts = parseCourseName(course.data.fullname);
</script>

<li class="flex items-center justify-between">
	<p class="flex-grow">
		<a
			href="/course/{course.data.id}"
			class="underline decoration-sky-300 decoration-2 underline-offset-1"
		>
			{@html parts.name}
		</a>
		{#if parts.code}
			<br />
			<span class="text-xs uppercase tracking-wider text-sky-600">{parts.code} · {parts.class}</span
			>
		{/if}
	</p>
	<div class="flex w-32 flex-none justify-end">
		<button
			class="rounded-full border-2 px-2 py-2 text-sm font-medium
			{course.following
				? 'border-sky-600 bg-sky-600 text-sky-50 shadow shadow-sky-700/30'
				: 'border-slate-100 text-slate-400 hover:border-sky-200 hover:text-sky-700'}
			"
			on:click={async () => {
				course.following = !course.following;
				const db = await dbPromise;
				await db.put('courses', course);
			}}
		>
			{course.following ? 'Bỏ theo dõi' : 'Theo dõi'}
		</button>
	</div>
</li>
