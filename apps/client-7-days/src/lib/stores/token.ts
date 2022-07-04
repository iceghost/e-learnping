import { Client } from 'moodle';
import { tick } from 'svelte';
import { writable, type Readable } from 'svelte/store';
import { db } from './db';

function createTokenStore() {
	let $resolve: ($token: string | null) => void;

	const store = writable<{ sync: string | null; async: Promise<string | null> }>({
		sync: null,
		async: new Promise((resolve) => ($resolve = resolve))
	});

	db.then(async ($db) => {
		const token: string | null = (await $db.get('kv', 'token')) ?? null;
		store.update(($token) => {
			$token.sync = token;
			$resolve(token);
			return $token;
		});
	});

	const set = async (newToken: string) => {
		store.update(($token) => {
			$token.async = new Promise((resolve) => ($resolve = resolve));
			return $token;
		});

		try {
			const client = new Client(newToken);
			await client.getSiteInfo();
			store.update(($token) => {
				$token.sync = newToken;
				$resolve(newToken);
				return $token;
			});
			const $db = await db;
			await $db.put('kv', newToken, 'token');
		} catch {
			store.update(($token) => {
				$resolve($token.sync);
				return $token;
			});
			throw new Error('Invalid token');
		}
	};

	return {
		...store,
		set
	};
}

export const token = createTokenStore();
