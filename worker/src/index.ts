import { Client } from './moodle';
import { Classification, GetEnrolledCourses } from './moodle/courses';
import { GetUpdatesSince } from './moodle/updates';

import { startOfQuarter } from 'date-fns';

export interface Env {
    ELEARNING_TOKEN: string;

    // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
    // MY_KV_NAMESPACE: KVNamespace;
    //
    // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
    // MY_DURABLE_OBJECT: DurableObjectNamespace;
    //
    // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
    // MY_BUCKET: R2Bucket;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        const moodle = new Client(env.ELEARNING_TOKEN);

        const result = await moodle.getContents(115364);

        return Response.json(result);
    },
};
