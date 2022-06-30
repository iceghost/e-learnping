import { Module, Update, WSFunction } from '.';
import { GetEnrolledCourses } from './base/get_enrolled_courses';
import { GetContents } from './base/get_contents';
import { GetUpdatesSince } from './base/get_updates_since';
import { GetGroups } from './base/get_groups';
import { GetSiteInfo } from './base/get_site_info';

export class Client {
    baseUrl: URL;

    defaultParams: Record<string, string>;

    fetcher = Client.baseFetcher;

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
    >(func: F, fetcher = this.fetcher): (...args: P) => Promise<R> {
        const url = new URL(this.baseUrl.toString());

        return async (...params) => {
            const wsparams = func.encode(...params);
            url.search = new URLSearchParams({
                ...this.defaultParams,
                ...wsparams,
            }).toString();

            const res = await fetcher(url);

            const body = await res.json();

            if (body['errorcode']) {
                throw body;
            }

            return await func.decode(body);
        };
    }

    static async baseFetcher(url: URL): Promise<Response> {
        if (url.searchParams.has('cacheKey')) {
            url.searchParams.delete('cacheKey');
        }
        return await fetch(url.toString(), {
            headers: {
                Connection: 'keep-alive',
            },
        });
    }

    get getUpdatesSince() {
        return this.call(GetUpdatesSince);
    }

    get getEnrolledCourses() {
        return this.call(GetEnrolledCourses);
    }

    get getGroups() {
        return this.call(GetGroups);
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

    get getSiteInfo() {
        return this.call(GetSiteInfo);
    }
}
