import { Client } from 'moodle';
import { dbPromise } from './db';

export const tokenPromise = new Promise<string | null>(async (resolve) => {
	const db = await dbPromise;
	const token: string | undefined = await db.get('kv', 'token');
	resolve(token ?? null);
});

export async function setToken(newToken: string) {
	const moodle = new Client(newToken);
	try {
		await moodle.getSiteInfo();
	} catch {
		throw new Error('Set token không thành công. Kiểm tra lại token nhen');
	}
	const db = await dbPromise;
	db.put('kv', newToken, 'token');
}
