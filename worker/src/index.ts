/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

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
        const url = new URL(
            'http://e-learning.hcmut.edu.vn/webservice/rest/server.php'
        );
        const DEFAULT_ARGS = {
            moodlewsrestformat: 'json',
            wstoken: env.ELEARNING_TOKEN,
        } as const;

        url.search = new URLSearchParams(DEFAULT_ARGS).toString();
        url.searchParams.set(
            'wsfunction',
            'core_course_get_enrolled_courses_by_timeline_classification'
        );
        url.searchParams.set('classification', 'inprogress');

        return await fetch(url.toString());

        // return new Response(env.ELEARNING_TOKEN);
    },
};
