<script lang="ts">
	import { page } from '$app/stores';

	import PageHeading from '$lib/components/PageHeading.svelte';

	import { setToken, getToken } from '$lib/stores/token';

	let success: boolean | undefined = undefined;

	$: if (success) {
		new Promise((resolve) => setTimeout(resolve, 4000)).then(() => {
			history.back();
		});
	}

	function submit(node: HTMLFormElement) {
		const handler = async (e: SubmitEvent) => {
			e.preventDefault();
			const data = new FormData(node);
			const newToken = data.get('token')?.toString() || '';
			try {
				await setToken($page.stuff.db, newToken);
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

<div class="my-5 mx-auto w-full max-w-sm">
	<PageHeading>Đăng nhập</PageHeading>
	<div class="mt-3">
		{#await getToken then prevToken}
			{#if prevToken}
				<p class="text-slate-700">Đã đăng nhập.</p>
			{:else if success === true}
				<p class="text-slate-700">Đăng nhập thành công, để mình điều hướng về trang chủ...</p>
				<p class="text-slate-500 text-sm">
					(Nếu nó không về sau 5 giây thì bạn có thể bấm vào <a
						href="/"
						class="underline underline-offset-1 decoration-2 decoration-amber-400"
						style:text-decoration-skip-ink="none">đây</a
					>)
				</p>
			{:else}
				<form use:submit class="flex">
					<div class="relative flex-grow top-0 bg-white/80">
						<input
							name="token"
							type="password"
							class="block h-full w-full rounded-l-md border-r-0 border-2 border-slate-200 py-2 pl-8 text-slate-500 placeholder:text-slate-300"
							placeholder="token từ BKeL"
						/>
						<!-- prettier-ignore -->
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300 absolute inset-y-0 left-2 my-auto pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
							</svg>
					</div>
					<button
						class="border-2 border-sky-200 text-sky-900 hover:border-sky-600 hover:bg-sky-600 hover:text-sky-50 px-2 rounded-r-md hover:shadow shadow-sky-700/30 transition-colors font-medium"
						>Set token</button
					>
				</form>
			{/if}
		{/await}
	</div>
	<h2 class="mt-10 text-lg font-bold text-slate-800">Câu hỏi thường gặp</h2>
	<div
		class="[&_mark]:bg-amber-50 [&_mark]:px-1 [&_mark]:text-sm [&_mark]:text-amber-600 mt-5 space-y-5 text-justify text-slate-400"
	>
		<details open>
			<summary
				class="mb-1 font-medium text-slate-600 underline decoration-sky-300 decoration-2 underline-offset-1"
				>Token lấy từ đâu?</summary
			>
			<ol class="ml-5 list-decimal accent-slate-200">
				<li>Vào BKeL, click vào <mark>avatar</mark> ở góc phải trên.</li>
				<li>Click <mark>Tùy chọn</mark> từ menu hiện ra.</li>
				<li>Tìm tùy chọn có tên là <mark>Security keys</mark></li>
				<li>Lấy token tên <mark>Moodle mobile web service</mark></li>
			</ol>
		</details>
		<details open class="space-y-2">
			<summary
				class="mb-1 font-medium text-slate-600 underline decoration-sky-300 decoration-2 underline-offset-1"
				>Token được sử dụng như thế nào?</summary
			>
			<p>
				Mình lưu token trong trình duyệt của bạn, cụ thể là dùng <mark>IndexedDB</mark>. Mình hoàn
				toàn không đụng gì tới token của bạn hết.
			</p>
			<p>
				Trong trường hợp bạn nghĩ token đã bị đánh cắp gì gì đấy, bạn có thể lên BKeL theo hướng dẫn
				ở trên và bấm <mark>Tái lập</mark> cạnh token để reset lại token.
			</p>
			<p>
				Mã nguồn của web được đăng tải lên mạng, nên nếu nghi ngờ thì bạn có thể check qua để xem
				mình có gì mờ ám hay không.
			</p>
		</details>
	</div>
</div>
