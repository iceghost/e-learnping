import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, url }) => {
	const res = await fetch(`http://e-learning.hcmut.edu.vn/${params.rest}${url.search}`);
	return {
		status: 200,
		headers: {
			...res.headers,
			'Content-Type': 'application/json'
		},
		body: res.body
	};
};
