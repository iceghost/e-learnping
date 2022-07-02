export { GetEnrolledCourses } from './base/get_enrolled_courses';
export { GetGroups } from './base/get_groups';
export { GetUpdatesSince } from './base/get_updates_since';
export { GetContents } from './base/get_contents';
export { Client } from './client';

export interface WSParams {
    wsfunction: string;
    cacheKey?: string;
}

export interface WSFunction<P extends any[], R> {
    encode(...params: P): WSParams;
    decode(body: any): R | Promise<R>;
}

export interface CachableWSFunction<P extends any[], R>
    extends WSFunction<P, R> {
    cacheKey(...params: P): string;
}

export type Course = {
    id: number;
    fullname: string;
    coursecategory: string;
};

export enum Classification {
    FUTURE = 'future',
    INPROGRESS = 'inprogress',
    PAST = 'past',
}

export type Update = {
    // module id
    id: number;
    updates: UpdateDetail[];
};

export type UpdateDetail =
    | {
          name: 'configuration';
          timeupdated: number;
          itemids?: never;
      }
    | {
          name: Omit<string, 'configuration'>;
          itemids?: number[];
      };

export type Section = {
    id: number;
    name: string;
    modules: Module[];
};

export type Module = {
    id: number;
    name: string;
    url: string;
    modname: string;
    modicon: string;
    description: string;
};

export type Group = {
    id: number;
    name: string;
    courseid: number;
};

export type Info = {
    firstname: string;
    lastname: string;
    fullname: string;
};
