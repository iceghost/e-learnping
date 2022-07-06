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
	import pDebounce from 'p-debounce';

	let search = '';
	export let courses: Promise<DBCourse[]> = Promise.race([]);

	let state = 'fresh';

	async function refresh() {
		state = 'stale';
		const newCourses = await refreshCourses($page.stuff.db, $page.stuff.token);
		courses = Promise.resolve(newCourses);
		state = 'fresh';
	}

	const setSearch = pDebounce((val: string) => (search = val), 1000);
</script>

<div class="mx-auto min-h-screen w-full max-w-sm bg-slate-100">
	<PageHeading title="Danh sách site môn">
		<p class="mt-2 text-justify text-sm font-medium text-sky-50">
			Các site để nhóm lớp là site lớp nhỏ, các site để tên giảng viên là site lớp lớn.
		</p>
		<p class="mt-2 text-justify text-sm font-medium text-sky-50">
			Lần đầu, bạn phải tự chọn theo dõi các site. Đến kỳ mới, web sẽ tự bấm theo dõi các site mới
			cho bạn.
		</p>
		<p class="mt-2 text-justify text-sm font-medium text-sky-50">
			Hãy nhớ bỏ theo dõi những môn không còn quan tâm nữa nhé.
		</p>
	</PageHeading>
	<div class="sticky top-2 mx-4 -mt-6 py-2">
		<form on:submit|preventDefault>
			<input
				type="text"
				class="block h-full w-full rounded-full bg-white py-2 pl-8
			font-functional text-slate-500 shadow-md placeholder:text-slate-400 focus:placeholder:text-slate-300"
				on:input={(e) => setSearch(e.currentTarget.value)}
				placeholder="Tìm site..."
			/>
		</form>
		<!-- prettier-ignore -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300 absolute inset-y-0 left-2 my-auto pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
		</svg>
	</div>
	{#await courses then courses}
		{@const processed = process(courses, search)}
		<div class="mt-2 space-y-3">
			{#each processed as [category, courses]}
				<details open>
					<summary class="font-display px-4 py-3 font-bold text-slate-500">
						{category.name}
					</summary>
					<ul class="px-3 bg-white divide-y divide-slate-100">
						{#each courses as course}
							<Course {course} />
						{/each}
					</ul>
				</details>
			{/each}
		</div>
		<p class="text-sm font-functional mt-4 text-center text-slate-700">
			Không tìm thấy môn cần tìm?<br /><button
				class="mt-2 inline-flex items-center space-x-1 rounded-full bg-white p-2 text-sm font-medium disabled:cursor-wait"
				on:click={() => refresh()}
				disabled={state === 'stale'}
				class:shadow={state !== 'stale'}
				class:text-slate-600={state !== 'stale'}
				class:text-slate-400={state === 'stale'}
			>
				<!-- prettier-ignore -->
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"
					class:animate-spin={state === "stale"}
				>
				<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
				</svg>
				<span class="font-functional font-semibold">Tải lại danh sách</span>
			</button>
			<span class="mt-2 block text-xs text-slate-400 font-functional">
				(mặc định mỗi tuần, danh sách được tải lại 1 lần)
			</span>
		</p>
	{/await}
</div>
