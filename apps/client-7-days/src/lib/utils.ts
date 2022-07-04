import { browser } from '$app/env';

export const browserPromise = new Promise<void>(async (resolve) => {
	if (browser) resolve();
});
