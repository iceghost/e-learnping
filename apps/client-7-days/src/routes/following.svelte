<script lang="ts">
	import PageHeading from '../lib/components/PageHeading.svelte';

	import { getSemester, parseCategory, parseCourseName } from '$lib/parsers';
	import { data, state } from '$lib/stores/courses';
	import { groupBy } from '$lib/utils';
	import Course from './following/_Course.svelte';

	export let search = '';

	$: console.log($data, $state);

	$: filtered = $data.filter((course) => course.data.fullname.toLocaleLowerCase().includes(search));

	$: parsed = filtered
		.map((course) => ({
			...course,
			parts: parseCourseName(course.data.fullname)
		}))
		.sort((a, b) => a.parts.code.localeCompare(b.parts.code));

	$: processed = Array.from(groupBy(parsed, (course) => course.data.coursecategory).entries())
		.map((tup) => [{ ...parseCategory(tup[0]), semester: getSemester(tup[0]) }, tup[1]] as const)
		.sort((a, b) => -a[0].semester + b[0].semester);
</script>

<div class="mx-auto mt-5 w-full max-w-sm px-2">
	<PageHeading>Danh sách site môn</PageHeading>
	<p class="mt-3 text-slate-700">
		Có thể có nhiều site cho một môn. Các site để nhóm lớp <span
			class="text-sm tracking-wider text-sky-600">L00</span
		> là site lớp nhỏ, những môn để tên giảng viên là site lớp lớn.
	</p>
	<div class="sticky top-0 bg-white/80 py-2">
		<input
			type="text"
			class="block h-full w-full rounded-full border-2 border-slate-200 bg-white/80
			py-2 pl-8 text-slate-500 placeholder:text-slate-300"
			bind:value={search}
			placeholder="Tìm kiếm..."
		/>
		<!-- prettier-ignore -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300 absolute inset-y-0 left-2 my-auto pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
		</svg>
	</div>
	{#if $state !== 'initial'}
		{#each processed as [category, courses]}
			<details open>
				<summary class="mt-8 mb-5 border-b-2 border-slate-100 pb-1 font-semibold text-sky-700">
					{category.name}
				</summary>
				<ul class="space-y-3">
					{#each courses as course}
						<Course {course} />
					{/each}
				</ul>
			</details>
		{/each}
	{/if}
</div>
