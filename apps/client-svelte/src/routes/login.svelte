<script lang="ts">
    import { initService } from '$lib/machines/initialization';

    const service = initService();

    let token: string = '';

    function submit() {
        service.send({ type: 'Submit token', data: { token } });
    }
</script>

<form on:submit|preventDefault={submit}>
    <label>
        Token
        <input type="password" bind:value={token} />
    </label>

    <button>Đăng nhập</button>
</form>
