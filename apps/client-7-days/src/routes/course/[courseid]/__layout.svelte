<script context="module" lang="ts">
	import { dbPromise, type DBCourse } from '$lib/stores/db';
	import { browser } from '$app/env';
	import type { DBContent } from '$lib/stores/db';
	import { refreshContent } from '$lib/stores/content';

	export const load: import('./__types/__layout').Load = async ({ params }) => {
		if (!browser) return {};

		const db = await dbPromise;

		const courseid = parseInt(params.courseid);
		const course = await db.get('courses', courseid);
		if (!course) return { status: 404 };

		const content = await refreshContent(courseid);

		return {
			props: {
				course,
				content
			},
			stuff: {
				course,
				content
			}
		};
	};
</script>

<script lang="ts">
	export let course: Promise<DBCourse> = Promise.race([]);
	export let content: Promise<DBContent> = Promise.race([]);
</script>

{#await Promise.all([course, content]) then [course, content]}
	<slot />
{/await}
