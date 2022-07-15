import { PushSubscription } from 'web-push';

export const post: ExportedHandlerFetchHandler<Env> = async (req, env, ctx) => {
    const subscription: PushSubscription = await req.json();

    await env.PUSH_SUBSCRIPTION.put(
        subscription.endpoint,
        JSON.stringify(subscription)
    );

    const response = new Response(null);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
};
