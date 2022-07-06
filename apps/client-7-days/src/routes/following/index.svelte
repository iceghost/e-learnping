<script lang="ts" context="module">
	import { process, refreshCourses } from '$lib/stores/courses';

	export const load: import('./__types/index').Load = async ({ stuff: { token, db } }) => {
		if (!token) return {};
		db = db!;

		const courses = await refreshCourses(db, token);

		return { props: { courses }, stuff: { courses } };
	};
</script>

<script lang="ts">
	import PageHeading from '$lib/components/PageHeading.svelte';
	import Course from './_Course.svelte';
	import type { DBCourse } from '$lib/stores/db';
	import { page } from '$app/stores';

	let search = '';
	export let courses: Promise<DBCourse[]> = Promise.race([]);

	let state = 'fresh';

	async function refresh() {
		state = 'stale';
		await refreshCourses($page.stuff.db, $page.stuff.token);
		state = 'fresh';
	}
</script>

<div class="mx-auto mt-5 w-full max-w-sm px-2">
	<PageHeading>Danh sách site môn</PageHeading>
	<p class="mt-3 text-slate-700">
		Có thể có nhiều site cho một môn. Các site để nhóm lớp <span
			class="text-sm tracking-wider text-sky-600">L00</span
		> là site lớp nhỏ, những site để tên giảng viên là site lớp lớn.
	</p>
	<p class="mt-2 text-slate-700">
		Lần đầu, bạn phải chọn theo dõi các site cần quan tâm. Đến kỳ mới, khi các site mới được thêm
		vào, web sẽ tự bấm theo dõi cho bạn.
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
	{#await courses then courses}
		{@const processed = process(courses)}
		{#each processed as [category, courses]}
			<details open>
				<summary
					class="mt-8 mb-5 border-b-2 border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-sky-700"
				>
					{category.name}
				</summary>
				<ul class="space-y-3">
					{#each courses as course}
						<Course {course} />
					{/each}
				</ul>
			</details>
		{/each}
		<p class="mt-10 text-center text-slate-700">
			Không tìm thấy môn cần tìm? <button
				class="mt-2 inline-flex items-center space-x-1 rounded-full bg-slate-100 p-2 text-sm font-medium disabled:cursor-wait"
				on:click={() => refresh()}
				disabled={state === 'stale'}
				class:text-slate-600={state !== 'stale'}
				class:text-slate-400={state === 'stale'}
			>
				<!-- prettier-ignore -->
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"
					class:animate-spin={state === "stale"}
				>
				<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
				</svg>
				<span>Tải lại danh sách</span>
			</button>
			<span class="mt-2 block text-xs text-slate-400"
				>(mặc định mỗi tuần, danh sách được tải lại 1 lần)</span
			>
		</p>
	{/await}
</div>
