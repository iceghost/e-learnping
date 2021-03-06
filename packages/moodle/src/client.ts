import { Classification, Module, Update, WSFunction } from '.';
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
        this.baseUrl = new URL(baseUrl + '/webservice/rest/server.php');
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

    async getCourses() {
        const coursess = await Promise.all(
            Object.values(Classification).map(async (classification) => {
                return await this.getEnrolledCourses(classification);
            })
        );
        return coursess.flat();
    }

    get getGroups() {
        return this.call(GetGroups);
    }

    get getContents() {
        return this.call(GetContents);
    }

    get getSiteInfo() {
        return this.call(GetSiteInfo);
    }
}
