<script lang="ts">
    import '../app.css';
    import { machine, setInitService } from '$lib/machines/initialization';
    import { useMachine } from '@xstate/svelte';
    import { session } from '$app/stores';
    import Logo from '$lib/Logo.svelte';
    import { fly } from 'svelte/transition';
    import { readable } from 'svelte/store';

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

    const encouragement = readable('', (set) => {
        const list = [
            '(đợi chút...)',
            '(chắc là một chút nữa thôi...)',
            '(một tí nữa...)',
        ];

        let i = 0;
        const handle = setInterval(() => {
            let oldi = i;
            while (i == oldi) i = Math.trunc(Math.random() * list.length);
            set(list[i]);
        }, 10000);

        return () => clearInterval(handle);
    });
</script>

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
        class="absolute inset-0 flex items-center justify-center sm:justify-start"
    >
        <div
            class="sm:ml-16 bg-slate-100 w-full max-w-sm p-5 space-x-5 rounded-md flex items-stretch shadow-sm"
            out:fly
        >
            <div class="rounded-md overflow-hidden">
                <img
                    alt="cats playing ping pong"
                    src="/loading.gif"
                    class="object-cover h-24 w-48 mix-blend-luminosity filter"
                />
            </div>
            <div class="w-full flex flex-col justify-around items-center">
                <Logo />
                <span class="text-sky-800">
                    {#if $initState.matches('No database')}
                        Thiết đặt database...
                    {:else if $initState.matches('Database')}
                        Lấy token...
                    {:else if $initState.matches('Database with token')}
                        Thử đăng nhập...
                    {:else if $initState.matches('Redirecting to login')}
                        Điều hướng về đăng nhập...
                    {:else if $initState.matches('Redirecting to home')}
                        Điều hướng về trang chủ...
                    {:else if $initState.matches('Database, token with info')}
                        Lưu token...
                    {:else if $initState.matches('User is authenticated')}
                        Tải dữ liệu từ web trường...<br />{$encouragement}
                    {:else if $initState.matches('Broken database')}
                        IndexedDB xài không được :(
                    {:else if $initState.matches('Server is down')}
                        Web trường sập hay gì rồi :(
                    {/if}
                </span>
            </div>
        </div>
    </div>
{/if}
