<script context="module" lang="ts">
	import { updateCourses } from '$lib/stores/updates';
	import type { Readable } from 'svelte/store';

	export const load: import('./__types/index').Load = ({ stuff: { token, db } }) => {
		if (!token) return {};
		db = db!;

		return {
			props: {
				...updateCourses(db, token)
			}
		};
	};
</script>

<script lang="ts">
	import type { DBUpdate } from '$lib/stores/db';

	export let current: Readable<number>;
	export let total: Readable<number>;
	export let updates: Readable<DBUpdate[]>;
</script>

<ul class="list list-disc">
	<li class="ml-6"><a href="/following" class="underline">Danh sách site</a></li>
</ul>

<p>{Math.trunc($current)} / {$total}</p>

{#if $updates}
	{#each $updates as update ([update.since, update.data.id])}
		<p>{update.since}</p>
	{/each}
{/if}
