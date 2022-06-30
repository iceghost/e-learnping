<script>
    import { BASE, post } from '$lib/api';
    import { onMount } from 'svelte';
    import { VAPID_PUBLIC_KEY } from 'vapid-keys';
    import * as moodle from 'moodle';
    import PQueue from 'p-queue';
    import { session } from '$app/stores';

    const queue = new PQueue({
        concurrency: 8,
        intervalCap: 8,
        interval: 1000,
    });

    async function subscribe() {
        const registration = await navigator.serviceWorker.ready;
        console.log(await registration.pushManager.permissionState());
        const oldSubscription =
            await registration.pushManager.getSubscription();

        if (oldSubscription) {
            // alert('already subscribed :)');
            // return;
            oldSubscription.unsubscribe();
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: VAPID_PUBLIC_KEY,
        });

        const res = await post('/subscription', subscription.toJSON());
        console.log(res);
    }

    const client = new moodle.Client($session.token);

    async function getCourses() {
        const courses = await client.getEnrolledCourses(
            moodle.Classification.INPROGRESS
        );

        const promises = courses.map(async (course) => {
            const res = await queue.add(() =>
                client.getUpdatesAndModules(course.id, new Date(2022, 5, 24))
            );
            const filtered = res.filter(({ update }) => update !== undefined);
            if (filtered.length != 0) {
                console.log(course.fullname, filtered);
            }
        });

        await Promise.all(promises);
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<p>
    {$session.info.fullname}
</p>

<button on:click={subscribe}>Subscribe</button>
<button on:click={getCourses}>Get courses content</button>
