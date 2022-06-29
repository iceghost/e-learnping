import type { DBSchema, IDBPDatabase } from 'idb';
import type { Course, Group, Module } from 'moodle';

export type DBInstance = IDBPDatabase<MyDB>;

export interface MyDB extends DBSchema {
    kv: {
        key: string;
        value: string;
    };
    modules: {
        value: Module;
        key: number;
    };
    courses: {
        value: Course;
        key: number;
    };
    groups: {
        value: Group;
        key: number;
        indexes: { 'by-courseid': number };
    };
}
