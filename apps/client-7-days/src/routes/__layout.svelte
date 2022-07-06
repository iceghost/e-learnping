<script context="module" lang="ts">
	import { server } from '$app/env';
	import { getDBInstance } from '$lib/stores/db';
	import { getToken } from '$lib/stores/token';
	import { redirect } from '$lib/utils';

	export const load: import('./__types/__layout').Load = async ({ url }) => {
		// server rendered
		if (server) return {};
		const db = await getDBInstance();

		// check authenticated
		const token = await getToken(db);
		if (url.pathname !== '/login' && token === null) {
			return redirect('/login', 302);
		}

		// if url is /login
		if (!token) return {};

		// authenticated
		return { stuff: { token, db } };
	};
</script>

<script lang="ts">
	import '../app.css';
</script>

<slot />
