<script context="module" lang="ts">
	import { refreshContent } from '$lib/stores/content';

	export const load: import('./__types/__layout').Load = async ({
		params,
		stuff: { token, db }
	}) => {
		if (!token) return {};
		db = db!;

		const courseid = parseInt(params.courseid);
		const course = await db.get('courses', courseid);

		if (!course) return { status: 404 };

		const content = await refreshContent(db, token, courseid);

		return {
			stuff: {
				course,
				content
			}
		};
	};
</script>

<slot />
