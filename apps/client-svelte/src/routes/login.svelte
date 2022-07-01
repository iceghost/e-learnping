<script lang="ts">
    import { goto } from '$app/navigation';

    import Logo from '$lib/Logo.svelte';
    import { initService } from '$lib/machines/initialization';

    const { state, send } = initService();

    let token: string = '';

    function submit() {
        send({ type: 'Submit token', data: { token } });
    }

    $: if ($state?.context.info) {
        setTimeout(() => goto('/'), 2000);
    }
</script>

<div class="h-screen w-full flex items-center justify-center sm:justify-start">
    <div class="sm:ml-16 flex flex-col items-center">
        <div class="min-w-[30ch] bg-slate-100 p-5 rounded-md">
            <Logo />
            <p class="font-extralight text-slate-700 text-center text-sm">
                dùng thời gian để làm<br />chuyện gì đó có ích hơn cho đời 🏓
            </p>
            {#if !$state.context.info}
                <form class="mt-8" on:submit|preventDefault={submit}>
                    <label>
                        <span class="text-sky-800">Nhập token tại đây</span>
                        <input
                            class="mt-2 block w-full bg-slate-200 text-slate-500 px-4 py-3 rounded"
                            type="password"
                            bind:value={token}
                        />
                    </label>

                    <button
                        class="mt-4 block w-full px-4 py-3 bg-sky-600 rounded
                text-white uppercase text-sm tracking-widest font-semibold"
                        >Đăng nhập</button
                    >
                </form>
            {:else}
                <p class="text-center mt-4 text-sky-800">Đã đăng nhập</p>
                <p class="text-center mt-2 text-slate-500 text-sm">Đang về trang chủ...</p>
            {/if}
        </div>
        <p
            class="flex items-center space-x-1 text-sky-100 font-extralight mt-3 text-sm"
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="text-sky-200 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span>Làm sao để lấy token?</span>
        </p>
        <p
            class="flex items-center space-x-1 text-sky-100 font-extralight mt-2 text-sm"
        >
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="text-sky-200 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <span>Token được sử dụng như thế nào?</span>
        </p>
    </div>
</div>
