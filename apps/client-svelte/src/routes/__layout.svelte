<script lang="ts">
    import '../app.css';
    import { machine, setInitService } from '$lib/machines/initialization';
    import { useMachine } from '@xstate/svelte';
    import { session } from '$app/stores';
    import Logo from '$lib/Logo.svelte';

    const service = useMachine(machine);
    const initState = service.state;

    setInitService(service);

    $session;

    $: {
        const db = $initState.context.db;
        const token = $initState.context.token;
        const info = $initState.context.info;
        if (db && token && info) {
            session.set({ db, token, info });
        }
    }
</script>

<svelte:head>
    <link rel="preload" as="image" href="/background.jpg" />
    <link rel="preload" as="image" href="/loading.gif" />
</svelte:head>

<div
    class="-z-10 fixed inset-0 bg-sky-700
    bg-[url('/background.jpg')] bg-cover bg-blend-luminosity
    filter brightness-[.65] saturate-[1.5]"
/>
<span class="-z-10 fixed bottom-5 right-5 text-sky-100"
    >📸 bởi Lisa Keffer trên Unsplash</span
>
<!-- If initialization succeeded, or user is unauthenticated -->
{#if $initState.matches('Done') || $initState.matches('Database with no token')}
    <slot />
{:else}
    <div
        class="h-screen w-full flex items-center justify-center sm:justify-start"
    >
        <div
            class="sm:ml-16 bg-slate-100 p-5 space-x-5 rounded-md flex items-stretch justify-around shadow-sm"
        >
            <img
                alt="cats playing ping pong"
                src="/loading.gif"
                class="h-24 w-32 rounded-md mix-blend-luminosity filter"
            />
            <div class="flex flex-col justify-around items-center">
                <Logo />
                <span class="text-sky-800">loading ...</span>
            </div>
        </div>
    </div>
{/if}
