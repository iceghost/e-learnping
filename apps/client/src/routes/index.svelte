<script>
    import { post } from '$lib/api';
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
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<button on:click={subscribe}>Subscribe</button>
