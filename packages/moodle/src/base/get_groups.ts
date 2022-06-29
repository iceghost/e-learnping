import { Group } from '..';

export const GetGroups = {
    encode() {
        return { wsfunction: 'core_group_get_course_user_groups' };
    },
    decode(body: { groups: Group[] }) {
        return body.groups;
    },
};
