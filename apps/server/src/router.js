import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from './prisma.js';
import { ping } from './web_push.js';

const subscriptionSchema = z.object({
	endpoint: z.string(),
	keys: z.object({
		auth: z.string(),
		p256dh: z.string(),
	}),
});

export const appRouter = trpc
	.router()
	.mutation('putSubscription', {
		input: subscriptionSchema,
		async resolve({ input }) {
			await prisma.pushSubscription.upsert({
				where: { endpoint: input.endpoint },
				create: { endpoint: input.endpoint, ...input.keys, lastPing: new Date(0) },
				update: {},
			});
		},
	})
	.mutation('pingSubscriptions', {
		async resolve() {
			// limit how often the ping is
			// but umm... how to you call this in english
			const leastPing = new Date(Date.now() - 30 * 60 * 1000);
			const subscriptions = await prisma.pushSubscription.findMany({
				where: { lastPing: { lt: leastPing } },
			});

			// we probably don't need to do this in parallel yet
			for (const subscription of subscriptions) {
				const status = await ping({
					endpoint: subscription.endpoint,
					keys: subscription,
				});
				if (status == 'ok') {
					await prisma.pushSubscription.update({
						where: { id: subscription.id },
						data: { lastPing: new Date() },
					});
					continue;
				} else if (status == 'delete this') {
					console.log('deleting subscription id', subscription.id);
					await prisma.pushSubscription.delete({
						where: { id: subscription.id },
					});
					continue;
				}
			}
		},
	})
	.mutation('hasSubscription', {
		input: subscriptionSchema,
		async resolve({ input }) {
			const subscription = await prisma.pushSubscription.findUnique({
				where: { endpoint: input.endpoint },
			});
			return subscription !== null;
		},
	});
