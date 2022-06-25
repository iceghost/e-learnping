<script>
    import { BASE, post } from '$lib/api';
    import { onMount } from 'svelte';
    import { VAPID_PUBLIC_KEY } from 'vapid-keys';
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

    async function getSSE() {
        const eventSrc = new EventSource(BASE + '/updates');

        eventSrc.addEventListener('message', (e) => {
            console.log(JSON.parse(e.data));
        });

        eventSrc.addEventListener('open', (e) => {
            console.log('open', e);
        });

        eventSrc.addEventListener('error', (e) => {
            console.log('error', e);
            eventSrc.close();
        });
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<button on:click={subscribe}>Subscribe</button>
<button on:click={getSSE}>Get courses content</button>
