<script lang="ts">
	import { setToken, tokenPromise } from '$lib/stores/token';

	let success: boolean | undefined = undefined;

	$: if (success) {
		new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
			history.back();
		});
	}

	function submit(node: HTMLFormElement) {
		const handler = async (e: SubmitEvent) => {
			e.preventDefault();
			const data = new FormData(node);
			const newToken = data.get('token')?.toString() || '';
			try {
				await setToken(newToken);
				success = true;
			} catch (e) {
				window.alert(e);
				success = false;
			}
		};

		node.addEventListener('submit', handler);
		return {
			destroy: () => node.removeEventListener('submit', handler)
		};
	}
</script>

{#await tokenPromise then prevToken}
	{#if !prevToken}
		<h1>Đăng nhập</h1>
		{#if success === true}
			Đăng nhập thành công, để mình điều hướng về trang chủ...
		{:else}
			<form use:submit>
				<input name="token" type="password" class="border" />
				<button>Set token</button>
			</form>
		{/if}
	{:else}
		Đã đăng nhập
	{/if}
{/await}
