<script lang="ts">
	export let title: string;
</script>

<details
	open
	class="group [&_mark]:bg-amber-50 [&_mark]:px-1 [&_mark]:text-base
    [&_mark]:text-amber-600"
>
	<summary class="mb-1 list-['❓'] group-open:list-['👉']">
		<span
			class="ml-1 font-functional font-semibold text-slate-600 underline decoration-sky-300 decoration-2 underline-offset-1"
		>
			{title}
		</span>
	</summary>
	<div class="ml-6 mt-2 space-y-2">
		<slot />
	</div>
</details>
