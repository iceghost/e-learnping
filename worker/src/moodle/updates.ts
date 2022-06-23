export interface Update {
    // module id
    id: number;
    updates: UpdateDetail[];
}

type UpdateDetail =
    | {
          name: 'configuration';
          timeupdated: number;
          timeids?: never;
      }
    | {
          name: string;
          itemids?: number[];
      };

export const GetUpdatesSince = {
    encode(courseid: number, since: Date) {
        return {
            since: since.getTime() / 1000,
            courseid: courseid,
            wsfunction: 'core_course_get_updates_since',
        };
    },
    decode(body: any) {
        return body;
    },
};
