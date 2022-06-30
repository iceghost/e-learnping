import { Section } from '..';

export const GetContents = {
    encode(courseid: number, group?: number) {
        return {
            courseid,
            wsfunction: 'core_course_get_contents',
        };
    },
    decode(body: Section[]): Section[] {
        return body;
    },
};
