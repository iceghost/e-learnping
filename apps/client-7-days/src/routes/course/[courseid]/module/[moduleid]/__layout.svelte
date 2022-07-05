<script context="module" lang="ts">
	import { dbPromise, type DBModule } from '$lib/stores/db';
	import { browser } from '$app/env';

	export const load: import('./__types/__layout').Load = async ({ params, stuff }) => {
		if (!browser) return {};

		const db = await dbPromise;

		const moduleid = parseInt(params.moduleid);
		const module = await db.get('modules', moduleid);
		if (!module) return { status: 404 };

		return {
			props: {
				module
			},
			stuff: {
				module
			}
		};
	};
</script>

<script lang="ts">
	export let module: Promise<DBModule> = Promise.race([]);
</script>

{#await module then}
	<slot />
{/await}
