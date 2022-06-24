// taken from https://github.com/sveltejs/realworld/blob/master/src/lib/api.js

import { dev } from '$app/env';

export const BASE = dev ? 'http://localhost:8787' : 'http://localhost:8787';

async function send({
    method,
    path,
    data,
    token,
}: {
    method: string;
    path: string;
    data?: any;
    token?: string;
}) {
    const reqInit: RequestInit = { method };

    if (data) {
        reqInit.headers = {
            ...reqInit.headers,
            'Content-Type': 'application/json',
        };
        reqInit.body = JSON.stringify(data);
    }

    if (token) {
        reqInit.headers = {
            ...reqInit.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    const req = new Request(new URL(path, BASE), reqInit);

    return fetch(req)
        .then((r) => r.text())
        .then((json) => {
            try {
                return JSON.parse(json);
            } catch (err) {
                return json;
            }
        });
}

export function get(path: string, token?: string) {
    return send({ method: 'GET', path, token });
}

export function del(path: string, token?: string) {
    return send({ method: 'DELETE', path, token });
}

export function post(path: string, data?: any, token?: string) {
    return send({ method: 'POST', path, data, token });
}

export function put(path: string, data?: any, token?: string) {
    return send({ method: 'PUT', path, data, token });
}
