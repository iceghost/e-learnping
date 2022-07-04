<script context="module" lang="ts">
	import { browser } from '$app/env';
	import { tokenPromise } from '$lib/stores/token';
	import { redirect } from '$lib/utils';

	export const load: import('./__types/__layout').Load = async ({ url }) => {
		// check authenticated
		if (browser && url.pathname !== '/login' && (await tokenPromise) === null) {
			return redirect('/login', 302);
		}
		return {};
	};
</script>

<script lang="ts">
	import '../app.css';
</script>

<slot />
