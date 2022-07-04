import { defineContext } from '$lib/context_utils';
import { type MyDB, type DBInstance, initDB } from '$lib/db';
import { openDB } from 'idb/with-async-ittr';
import { createMachine } from 'xstate';
import { escalate, assign } from 'xstate/lib/actions';
import { browser } from '$app/env';
import { goto } from '$app/navigation';
import type { UseMachineReturn } from './xstate-utils';
import { Client, type Info } from 'moodle';
import { update } from './update';

export const machine = createMachine(
    {
        id: 'Initialization',
        initial: 'No database',
        states: {
            'No database': {
                invoke: {
                    src: 'Initialize database',
                    onDone: [
                        {
                            actions: 'Save database instance',
                            target: 'Database',
                        },
                    ],
                    onError: [
                        {
                            target: 'Broken database',
                        },
                    ],
                },
            },
            Database: {
                invoke: {
                    src: 'Get token from database',
                    onDone: [
                        {
                            actions: 'Save token',
                            target: 'Database with token',
                        },
                    ],
                    onError: [
                        {
                            target: 'Redirecting to login',
                        },
                    ],
                },
            },
            'Database with token': {
                invoke: {
                    src: 'Get user info',
                    onDone: [
                        {
                            actions: 'Save user info',
                            target: 'Database, token with info',
                        },
                    ],
                    onError: [
                        {
                            cond: 'token is invalid',
                            target: 'Redirecting to login',
                        },
                        {
                            target: 'Server is down',
                        },
                    ],
                },
            },
            'Database, token with info': {
                invoke: {
                    src: 'Store token and info',
                    onDone: [
                        {
                            target: 'User is authenticated',
                        },
                    ],
                    onError: [
                        {
                            target: 'Broken database',
                        },
                    ],
                },
            },
            'Database with no token': {
                on: {
                    'Submit token': {
                        actions: 'Save token',
                        target: 'Redirecting to home',
                    },
                },
            },
            'Server is down': {
                type: 'final',
                entry: 'Send error message',
            },
            'Broken database': {
                entry: 'Send error message',
            },
            'Redirecting to login': {
                invoke: {
                    src: 'Redirect',
                    onDone: [
                        {
                            target: 'Database with no token',
                        },
                    ],
                },
            },
            'Redirecting to home': {
                invoke: {
                    src: 'Redirect',
                    onDone: [
                        {
                            target: 'Database with token',
                        },
                    ],
                },
            },
            'User is authenticated': {
                invoke: {
                    src: 'Refresh database',
                    onDone: [
                        {
                            target: 'Done',
                        },
                    ],
                    onError: [
                        {
                            target: 'Server is down',
                        },
                    ],
                },
            },
            Done: {
                type: 'final',
            },
        },
        context: {},
        tsTypes: {} as import('./initialization.typegen').Typegen0,
        schema: {
            events: {} as { type: 'Submit token'; data: { token: string } },
            context: {} as {
                db?: DBInstance;
                token?: string;
                info?: Info;
            },
            services: {} as {
                'Initialize database': {
                    data: {
                        db: DBInstance;
                    };
                };
                'Get token from database': {
                    data: {
                        token: string;
                    };
                };
                'Get user info': {
                    data: {
                        info: Info;
                    };
                };
                'Store token and info': {
                    data: void;
                };
                'Refresh database': {
                    data: void;
                };
            },
        },
    },
    {
        actions: {
            'Save database instance': assign({ db: (_, e) => e.data.db }),
            'Save user info': assign({ info: (_, e) => e.data.info }),
            'Save token': assign({ token: (_, e) => e.data.token }),
            'Send error message': escalate((_, e) => {
                switch (e.type) {
                    // broken database
                    case 'error.platform.Initialization.No database:invocation[0]':
                        return new Error('Broken database');

                    // server is down
                    case 'error.platform.Initialization.Database with token:invocation[0]':
                        return new Error('Server is down');
                }
            }),
        },
        guards: {
            'token is invalid': (_, e) => {
                const errorcode = (
                    e.data as Record<string, string | undefined>
                )['errorcode'];
                return errorcode !== undefined && errorcode === 'invalidtoken';
            },
        },
        services: {
            'Initialize database': async () => {
                const db = await initDB();
                return { db };
            },
            'Get token from database': async (ctx) => {
                const token = await ctx.db!.get('kv', 'token');
                // await delay(1000);
                if (!token) throw new Error();
                return { token };
            },
            'Get user info': async (ctx) => {
                const moodle = new Client(ctx.token!);
                const info = await moodle.getSiteInfo();
                return { info };
            },
            Redirect: async (_, e) => {
                if (e.type == 'Submit token') {
                    await goto('/');
                } else {
                    await goto('/login');
                }
            },
            'Store token and info': async ({ db, token, info }) => {
                await db!.put('kv', token!, 'token');
                await db!.put('kv', JSON.stringify(info!), 'info');
            },
            'Refresh database': async ({ db, token }) => {
                await update(new Client(token!), db!);
            },
        },
    }
);

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

const [initService, setInitService] =
    defineContext<UseMachineReturn<typeof machine>>();
export { initService, setInitService };
