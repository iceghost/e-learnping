import { add, differenceInSeconds } from 'date-fns';
import { browser } from '$app/env';

export const browserPromise = new Promise<void>(async (resolve) => {
	if (browser) resolve();
});

export const redirect = (path: string, status: number) => ({
	status,
	redirect: path
});

export function addRandom(date: Date | number, duration: Duration) {
	const newDate = add(date, duration);
	let seconds = differenceInSeconds(newDate, date);
	seconds = -Math.log(Math.random()) * seconds;
	return add(date, { seconds });
}

export type ResourceState = 'initial' | 'stale' | 'fresh';

export function groupBy<K, V>(arr: V[], keyFn: (input: V) => K): Map<K, V[]> {
	const map = new Map<K, V[]>();
	for (const item of arr) {
		const key = keyFn(item);
		const group = map.get(key);
		if (!group) {
			map.set(key, [item]);
		} else {
			group.push(item);
		}
	}
	return map;
}
