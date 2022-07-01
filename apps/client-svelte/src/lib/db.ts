import { browser } from '$app/env';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Course, Group, Module, Section, Update } from 'moodle';
import { writable } from 'svelte/store';

export type DBInstance = IDBPDatabase<MyDB>;

export interface MyDB extends DBSchema {
    kv: {
        key: string;
        value: string;
    };
    updates: {
        value: {
            update: Update;
            courseid: number;
            since: Date;
            until: Date;
        };
        key: number;
        indexes: { 'by-courseid': number };
    };
    modules: {
        value: {
            module: Module;
            sectionid: number;
        };
        key: number;
        indexes: { 'by-sectionid': number };
    };
    sections: {
        value: {
            section: Section;
            courseid: number;
        };
        key: number;
        indexes: { 'by-courseid': number };
    };
    courses: {
        value: {
            course: Course;
            nameParts: {
                name: string;
                code: string;
                class: string;
                semester: string;
            };
            updatedAt: Date;
            hidden: boolean;
        };
        key: number;
        indexes: {
            'by-semester-and-code': [string, string];
            'by-category-and-code': [string, string];
        };
    };
    categories: {
        value: {
            coursecategory: string;
            name: string;
            translation: string;
            semester: number;
            hidden: boolean;
        };
        key: string;
        indexes: { 'by-semester': number };
    };
    groups: {
        value: {
            group: Group;
        };
        key: number;
        indexes: { 'by-courseid': number };
    };
}

export const db = writable<DBInstance>();

export async function initDB() {
    if (!browser) return Promise.race([]);

    const instance = await openDB<MyDB>('elearnping', 1, {
        upgrade(db) {
            db.createObjectStore('kv');

            db.createObjectStore('updates', {
                autoIncrement: true,
            }).createIndex('by-courseid', 'courseid');

            db.createObjectStore('modules', {
                keyPath: 'module.id',
            }).createIndex('by-sectionid', 'sectionid');

            db.createObjectStore('sections', {
                keyPath: 'section.id',
            }).createIndex('by-courseid', 'courseid');

            const courseStore = db.createObjectStore('courses', {
                keyPath: 'course.id',
            });

            courseStore.createIndex('by-semester-and-code', [
                'nameParts.semester',
                'nameParts.code',
            ]);

            courseStore.createIndex('by-category-and-code', [
                'course.coursecategory',
                'nameParts.code',
            ]);

            db.createObjectStore('categories', {
                keyPath: 'coursecategory',
            }).createIndex('by-semester', 'semester');

            db.createObjectStore('groups', {
                keyPath: 'group.id',
            }).createIndex('by-courseid', 'courseid', {
                unique: true,
            });
        },
    });
    db.set(instance);
    return instance;
}
