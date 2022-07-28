import * as dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify/dist/trpc-server-adapters-fastify.cjs.js';
import { appRouter } from './router.js';
import webpush from 'web-push';

export const VAPID_PUBLIC_KEY =
	'BFLcpZA_Ljs6_3RMH1ABT8Z8hWeIgstEkSlXGO4EXlnatYw4cwuaujIFMnBqXdc1HV-ZxM5Wqd2ao5XhHMPeJEs';

webpush.setVapidDetails(
	'https://github.com/iceghost',
	VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY || '',
);

const fastify = Fastify({
	logger: {
		transport:
			process.env.ENVIRONMENT !== 'PRODUCTION'
				? {
						target: 'pino-pretty',
						options: {
							translateTime: 'HH:MM:ss Z',
							ignore: 'pid,hostname',
						},
				  }
				: undefined,
	},
});

fastify.register(fastifyTRPCPlugin, {
	prefix: '/trpc',
	trpcOptions: { router: appRouter, createContext: () => {} },
});

/** @type {import('web-push').PushSubscription} */
let x;

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

(async () => {
	try {
		await fastify.listen({ port: parseInt(process.env.PORT || '8080') });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
})();
