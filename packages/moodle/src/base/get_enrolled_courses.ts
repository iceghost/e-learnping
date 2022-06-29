import { Classification, Course } from '..';

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
