import { GetEnrolledCourses } from './courses';
import { GetContents } from './modules';
import { GetUpdatesSince } from './updates';

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
}
