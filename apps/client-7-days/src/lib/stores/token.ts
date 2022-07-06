import { Client } from 'moodle';
import type { DBInstance } from './db';

export const moodleClient = (token: string) =>
	new Client(token, new URL('/api', window.location.origin).toString());

export async function getToken(db: DBInstance) {
	const token: string | undefined = await db.get('kv', 'token');
	return token ?? null;
}

export async function setToken(db: DBInstance, newToken: string) {
	const moodle = moodleClient(newToken);
	try {
		await moodle.getSiteInfo();
	} catch {
		throw new Error('Set token không thành công. Kiểm tra lại token nhen');
	}
	await db.put('kv', newToken, 'token');
}
