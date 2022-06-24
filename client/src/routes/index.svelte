<script>
    async function subscribe() {
        const registration = await navigator.serviceWorker.ready;
        console.log(await registration.pushManager.permissionState());
        const subscription = await registration.pushManager.subscribe();
        console.log(subscription.toJSON());
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<button on:click={subscribe}>Subscribe</button>
