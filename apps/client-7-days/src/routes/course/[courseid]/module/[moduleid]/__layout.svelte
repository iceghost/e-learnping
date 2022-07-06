<script context="module" lang="ts">
	export const load: import('./__types/__layout').Load = async ({
		params,
		stuff: { db, token }
	}) => {
		if (!token) return {};
		db = db!;

		const moduleid = parseInt(params.moduleid);
		const module = await db.get('modules', moduleid);
		if (!module) return { status: 404 };

		return {
			stuff: {
				module
			}
		};
	};
</script>

<slot />
