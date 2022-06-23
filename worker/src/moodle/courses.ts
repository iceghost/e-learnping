export interface Course {
    id: number;
    fullname: string;
    coursecategory: string;
}

export enum Classification {
    FUTURE = 'future',
    INPROGRESS = 'inprogress',
    PAST = 'past',
}

export const GetEnrolledCourses = {
    encode(classification: Classification) {
        return {
            classification,
            wsfunction:
                'core_course_get_enrolled_courses_by_timeline_classification',
        };
    },

    decode(body: any): Course[] {
        return body.courses;
    },
};
