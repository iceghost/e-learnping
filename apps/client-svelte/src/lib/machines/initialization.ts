import { defineContext } from '$lib/context_utils';
import type { MyDB, DBInstance } from '$lib/db';
import { openDB } from 'idb';
import { createMachine } from 'xstate';
import { escalate, log, assign } from 'xstate/lib/actions';
import { browser } from '$app/env';
import { goto } from '$app/navigation';
import type { UseMachineReturn } from './xstate-utils';

export const machine = createMachine(
    {
        context: {},
        tsTypes: {} as import('./initialization.typegen').Typegen0,
        schema: {
            events: {} as { type: 'Submit token'; data: { token: string } },
            context: {} as {
                db?: DBInstance;
                token?: string;
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
                    data: {};
                };
            },
        },
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
                            target: 'Database with no token',
                        },
                        {
                            target: 'Server is down',
                        },
                    ],
                },
            },
            'Database, token with info': {
                type: 'final',
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
        },
    },
    {
        actions: {
            'Save database instance': assign({ db: (_, e) => e.data.db }),
            'Save user info': log(),
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
            'token is invalid': (ctx, e) => {
                return true;
            },
        },
        services: {
            'Initialize database': async () => {
                if (!browser) return Promise.race([]);

                const db = await openDB<MyDB>('elearnping', 1, {
                    upgrade(db) {
                        db.createObjectStore('kv');
                        db.createObjectStore('modules', { keyPath: 'id' });
                        db.createObjectStore('courses', { keyPath: 'id' });

                        const groupStore = db.createObjectStore('groups', {
                            keyPath: 'id',
                        });
                        groupStore.createIndex('by-courseid', 'courseid', {
                            unique: true,
                        });
                    },
                });
                return { db };
            },
            'Get token from database': async (ctx) => {
                const token = await ctx.db!.get('kv', 'token');
                if (!token) throw new Error();
                return { token };
            },
            'Get user info': async () => {
                return {};
            },
            Redirect: async (_, e) => {
                if (e.type == 'Submit token') {
                    await goto('/');
                } else if (
                    e.type ==
                    'error.platform.Initialization.Database:invocation[0]'
                ) {
                    await goto('/login');
                }
            },
        },
    }
);

const [initService, setInitService] =
    defineContext<UseMachineReturn<typeof machine>>();
export { initService, setInitService };
