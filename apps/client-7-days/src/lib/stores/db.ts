import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Course, Module, Section } from 'moodle';

export type DBCourse = {
	data: Course;
	following: boolean;
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
}

export type DBInstance = IDBPDatabase<Schema>;

export const getDBInstance = () =>
	openDB<Schema>('e-learnping', 1, {
		upgrade(db, oldVersion) {
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
			}
		}
	});
