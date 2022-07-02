import { Update } from '..';

export const GetUpdatesSince = {
    encode(courseid: number, since: Date) {
        return {
            since: Math.trunc(since.getTime() / 1000),
            courseid: courseid,
            wsfunction: 'core_course_get_updates_since',
        };
    },
    decode(body: { instances: Update[] }): Update[] {
        return body.instances;
    },
};
