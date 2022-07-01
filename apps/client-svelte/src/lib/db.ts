import type { DBSchema, IDBPDatabase } from 'idb';
import type { Course, Group, Module, Section, Update } from 'moodle';

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
        };
        key: number;
        indexes: { 'by-semester-and-code': [string, string] };
    };
    categories: {
        value: {
            coursecategory: string;
            name: string;
            translation: string;
            semester: number;
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
