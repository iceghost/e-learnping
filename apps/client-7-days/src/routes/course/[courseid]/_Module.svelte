<script lang="ts">
	import { page } from '$app/stores';

	export let id: number;
</script>

{#await $page.stuff.db.get('modules', id) then module}
	{#if module}
		<div class="flex items-center space-x-2 font-functional">
			<img src={module.data.modicon} alt="{module.data.modname} icon" class="w-5 h-5" />
			<span>
				<a
					href="/course/{$page.params.courseid}/module/{module.data.id}"
					class="font-medium underline decoration-2 underline-offset-1 decoration-sky-300 hover:bg-sky-50"
					style:text-decoration-skip-ink="none"
				>
					{module.data.name}
				</a>
			</span>
		</div>
		{#if module.data.description}
			<p class="ml-7 text-slate-500 [&_p]:!text-justify">
				{@html module.data.description}
			</p>
		{/if}
	{/if}
{/await}
