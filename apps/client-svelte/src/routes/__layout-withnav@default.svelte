<script lang="ts">
    import Logo from '$lib/Logo.svelte';
</script>

<div class="h-screen w-full flex items-center justify-center sm:justify-start">
    <div class="sm:mx-16 h-full sm:max-h-[calc(100vh-2rem)] w-full max-w-2xl flex flex-col">
        <div class="z-20 bg-slate-100 rounded-md flex py-2 px-4 shadow-md">
            <Logo />
        </div>
        <div
            class="relative z-10 -mt-2 pt-4 sm:mt-4 h-full overflow-scroll bg-slate-50 px-3 sm:px-5 rounded-md"
        >
            <slot />
        </div>
    </div>
</div>
