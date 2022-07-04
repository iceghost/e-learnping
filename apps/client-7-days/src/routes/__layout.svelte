<script context="module" lang="ts">
	import { browser } from '$app/env';
	import { token } from '$lib/stores/token';
	import { get } from 'svelte/store';

	export const load: import('./__types/__layout').Load = async ({ url }) => {
		// check authenticated
		if (browser && url.pathname !== '/login') {
			const $token = await get(token).async;
			if (!$token) {
				return {
					status: 302,
					redirect: '/login'
				};
			}
		}

		return {};
	};
</script>

<script lang="ts">
	import '../app.css';
</script>

{#await $token.async}
	Loading
{:then token}
	{token}
{/await}

<slot />
