<script lang="ts">
    import { initService } from '$lib/machines/initialization';

    const { state, send } = initService();

    let token: string = '';

    function submit() {
        send({ type: 'Submit token', data: { token } });
    }
</script>

{#if !$state.context.token}
    <form on:submit|preventDefault={submit}>
        <label>
            Token
            <input type="password" bind:value={token} />
        </label>

        <button>Đăng nhập</button>
    </form>
{:else}
    <p>Đã đăng nhập</p>
{/if}
