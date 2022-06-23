type Module = {
    id: number;
    name: string;
    modname: string;
};

export const GetContents = {
    encode(courseid: number) {
        return {
            courseid,
            wsfunction: 'core_course_get_contents',
        };
    },
    decode(body: Array<{ modules: Module[] }>): Module[] {
        return body.map((e) => e.modules).flat();
    },
};
