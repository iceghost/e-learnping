import { Classification, GetEnrolledCourses } from './courses';
import { GetContents, Module } from './modules';
import { GetUpdatesSince, Update } from './updates';

// reexports
export type { Module, Update };
export { Classification };

interface WSParams {
    wsfunction: string;
}

export interface WSFunction<P extends any[], R> {
    encode(...params: P): WSParams;
    decode(body: any): R | Promise<R>;
}

export class Client {
    baseUrl: URL;

    defaultParams: Record<string, string>;

    constructor(
        token: string,
        baseUrl: string = 'http://e-learning.hcmut.edu.vn'
    ) {
        this.baseUrl = new URL('/webservice/rest/server.php', baseUrl);
        this.defaultParams = {
            moodlewsrestformat: 'json',
            wstoken: token,
        };
    }

    call<
        F extends WSFunction<P, R>,
        P extends any[] = F extends WSFunction<infer P, any> ? P : never,
        R = F extends WSFunction<any, infer R> ? R : never
    >(func: F): (...args: P) => Promise<R> {
        const url = new URL(this.baseUrl.toString());

        return async (...params) => {
            url.search = new URLSearchParams({
                ...this.defaultParams,
                ...func.encode(...params),
            }).toString();

            const res = await fetch(url.toString());

            const body = await res.json();

            return await func.decode(body);
        };
    }

    get getUpdatesSince() {
        return this.call(GetUpdatesSince);
    }

    get getEnrolledCourses() {
        return this.call(GetEnrolledCourses);
    }

    get getContents() {
        return this.call(GetContents);
    }

    async getUpdatesAndModules(
        courseid: number,
        since: Date
    ): Promise<{ module: Module; update?: Update }[]> {
        const [modules, updates] = await Promise.all([
            this.getContents(courseid),
            this.getUpdatesSince(courseid, since),
        ]);

        let i = 0;
        return modules.map((module) => {
            if (i < updates.length) {
                const update = updates[i];
                if (update.id == module.id) {
                    i++;
                    return { module, update };
                }
            }
            return { module };
        });
    }
}
