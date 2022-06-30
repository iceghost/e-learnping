import type { DBSchema, IDBPDatabase } from 'idb';
import type { Course, Group, Module } from 'moodle';

export type DBInstance = IDBPDatabase<MyDB>;

export interface MyDB extends DBSchema {
    kv: {
        key: string;
        value: string;
    };
    modules: {
        value: {
            module: Module;
            expiresAt: Date;
        };
        key: number;
        indexes: { 'by-expiresAt': Date };
    };
    courses: {
        value: {
            course: Course;
            expiresAt: Date;
        };
        key: number;
        indexes: { 'by-expiresAt': Date };
    };
    groups: {
        value: {
            group: Group;
            expiresAt: Date;
        };
        key: number;
        indexes: { 'by-expiresAt': Date; 'by-courseid': number };
    };
}
