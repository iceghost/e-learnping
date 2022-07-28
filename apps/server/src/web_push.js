import webpush from 'web-push';

/**
 *
 * @param {import('web-push').PushSubscription} subscription
 * @returns {Promise<"ok" | "delete this" | "retry later">} if this subscription should be removed
 */
export async function ping(subscription) {
	try {
		// retry
		let result;
		let retriesLeft = 3;
		while (true) {
			result = await webpush.sendNotification(subscription);
			switch (result.statusCode) {
				case 201:
					return 'ok';

				// user unsubscribed
				case 404:
				case 410:
					return 'delete this';

				// retry
				case 429:
					if (retriesLeft == 0) return 'retry later';

					let header = result.headers['Retry-After'];
					// default
					let delay = 3000;
					if (header) {
						let seconds = parseInt(header);
						if (isNaN(seconds)) {
							let date = new Date(header);
							delay = +date - Date.now();
						} else {
							delay = seconds * 1000;
						}
					}

					retriesLeft--;
					await new Promise((resolve) => setTimeout(resolve, delay));

				default:
					// unreachable
					return 'ok';
			}
		}
	} catch (e) {
		console.error(e);
		return 'ok';
	}
}
