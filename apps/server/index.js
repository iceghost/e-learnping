import Fastify from 'fastify';

const fastify = Fastify({
	logger: {
		transport:
			process.env.ENVIRONMENT !== 'PRODUCTION'
				? {
						target: 'pino-pretty',
						options: {
							translateTime: 'HH:MM:ss Z',
							ignore: 'pid,hostname'
						}
				  }
				: undefined
	}
});

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

try {
	await fastify.listen({ port: process.env.PORT || 8080 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
