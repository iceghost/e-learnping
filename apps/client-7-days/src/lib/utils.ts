import { browser } from '$app/env';

export const browserPromise = new Promise<void>(async (resolve) => {
	if (browser) resolve();
});

export const redirect = (path: string, status: number) => ({
	status: 302,
	redirect: path
});
