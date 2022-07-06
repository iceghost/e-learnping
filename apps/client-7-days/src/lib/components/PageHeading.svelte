<script lang="ts">
	export let title: string;
</script>

<div class="relative bg-gradient-to-br from-sky-500 to-sky-600 pt-16 pb-10 pl-8 pr-8">
	<p class="absolute top-4 left-2 flex items-center text-sky-50">
		<!-- prettier-ignore -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
		</svg>
		<span class="font-functional font-medium">Trở về</span>
	</p>
	<h1
		class="font-display text-2xl font-extrabold tracking-tighter text-sky-50 underline decoration-sky-400 decoration-4 underline-offset-0"
		style:text-decoration-skip-ink="none"
	>
		{title}
	</h1>
	<slot />
</div>
