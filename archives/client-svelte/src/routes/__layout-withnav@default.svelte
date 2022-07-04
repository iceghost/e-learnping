<script lang="ts">
    import Logo from '$lib/Logo.svelte';
    import { fly } from 'svelte/transition';
</script>

<div class="absolute inset-0 overflow-hidden flex items-center justify-center sm:justify-start">
    <div
        class="sm:mx-16 h-full sm:max-h-[calc(100vh-2rem)] w-full max-w-2xl flex flex-col"
    >
        <div
            class="z-20 bg-slate-100 sm:rounded-md flex py-2 px-4 shadow-md rounded-b-md"
            in:fly={{y:-100, delay: 200 }}
        >
            <Logo />
        </div>
        <div
            class="relative z-10 -mt-2 pt-4 sm:pt-1 sm:mt-4 h-full overflow-auto bg-slate-50 px-3 sm:px-5 sm:rounded-md rounded-none"
            in:fly={{y:100, delay: 200 }}
        >
            <slot />
        </div>
    </div>
</div>
