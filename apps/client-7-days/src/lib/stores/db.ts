import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Course, Module, Section, Update } from 'moodle';

export type DBCourse = {
	data: Course;
	following: boolean;
	nextUpdateAt: Date;
};

export type DBContent = {
	courseid: Course['id'];
	expiresAt: Date;
	data: (Omit<Section, 'modules'> & {
		modules: Pick<Module, 'id'>[];
	})[];
};

export type DBModule = {
	data: Module;
};

export type DBUpdate = {
	data: Update;
	courseid: Course['id'];
	since: Date;
	until: Date;
};

export interface Schema extends DBSchema {
	kv: {
		value: any;
		key: string;
	};
	courses: {
		value: DBCourse;
		key: DBCourse['data']['id'];
	};
	contents: {
		value: DBContent;
		key: DBContent['courseid'];
	};
	modules: {
		value: DBModule;
		key: DBModule['data']['id'];
	};
	updates: {
		value: DBUpdate;
		key: [DBUpdate['since'], DBUpdate['data']['id']];
	};
}

export type DBInstance = IDBPDatabase<Schema>;

export const getDBInstance = () =>
	openDB<Schema>('e-learnping', 2, {
		async upgrade(db, oldVersion, _, tx) {
			switch (oldVersion) {
				// When the database is newly created, oldVersion is 0.
				// The fallthrough is intentional.
				case 0:
					db.createObjectStore('kv');

					db.createObjectStore('courses', {
						keyPath: 'data.id'
					});

					db.createObjectStore('contents', {
						keyPath: 'courseid'
					});

					db.createObjectStore('modules', {
						keyPath: 'data.id'
					});

				case 1:
					db.createObjectStore('updates', {
						keyPath: ['since', 'data.id']
					});
					if (oldVersion === 1) {
						tx.done.then(async () => {
							for await (const cursor of await db.transaction('courses', 'readwrite').store) {
								await cursor.update({ ...cursor.value, nextUpdateAt: new Date(0) });
							}
						});
					}
			}
		}
	});
