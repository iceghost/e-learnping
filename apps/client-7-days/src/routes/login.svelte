<script lang="ts">
	import { token } from '$lib/stores/token';
</script>

{#await $token.async then prevToken}
	{#if !prevToken}
		<h1>Đăng nhập</h1>

		<form
			on:submit|preventDefault={(e) => {
				const newToken = new FormData(e.currentTarget).get('token')?.toString() || '';
				token.set(newToken);
			}}
		>
			<input name="token" type="text" class="border" />
			<button>Set token</button>
		</form>
	{:else}
		Đã đăng nhập
	{/if}
{/await}
