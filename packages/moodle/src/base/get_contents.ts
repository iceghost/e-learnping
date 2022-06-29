import { Module } from '..';

export const GetContents = {
    encode(courseid: number, group?: number) {
        return {
            courseid,
            wsfunction: 'core_course_get_contents',
        };
    },
    decode(body: Array<{ modules: Module[] }>): Module[] {
        return body.map((e) => e.modules).flat();
    },
};
