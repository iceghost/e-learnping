import { defineContext } from '$lib/context_utils';
import type { MyDB, DBInstance } from '$lib/db';
import { openDB, type IDBPDatabase } from 'idb';
import { useMachine } from '@xstate/svelte';
import { assign, createMachine } from 'xstate';
import { escalate, log } from 'xstate/lib/actions';

const machine = createMachine(
    {
        context: {},
        tsTypes: {} as import('./initialization.typegen').Typegen0,
        schema: {
            events: {} as { type: never },
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
                entry: 'Save database instance',
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
                            target: 'Database with no token',
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
                            target: 'Server is down',
                        },
                    ],
                },
            },
            'Database, token with info': {
                type: 'final',
            },
            'Database with no token': {
                type: 'final',
            },
            'Server is down': {
                entry: 'Send error message',
            },
            'Broken database': {
                entry: 'Send error message',
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
    }
);

const service = useMachine(machine, {
    services: {
        'Initialize database': async () => {
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
    },
});

const [getContext, setContext] = defineContext<typeof service>();

export const setInitContext = () => {
    return setContext(service);
};

export const getInitContext = () => {
    return getContext();
}
