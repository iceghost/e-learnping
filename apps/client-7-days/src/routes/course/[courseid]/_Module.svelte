<script lang="ts">
	import { page } from '$app/stores';
	import { formatRelative } from 'date-fns';
	import { vi } from 'date-fns/locale';

	export let id: number;

	const formatRelativeLocale = {
		lastWeek: "'last' eeee 'at' p",
		yesterday: "p 'hôm qua'",
		today: "p 'bữa nay'",
		tomorrow: "p 'ngày mai'",
		nextWeek: "p eeee 'tuần sau'",
		other: "p 'hôm' P"
	};

	const format = (date: Date) =>
		formatRelative(date, new Date(), {
			locale: {
				...vi,
				formatRelative: (token: keyof typeof formatRelativeLocale) => formatRelativeLocale[token]
			}
		});

	const updates = $page.stuff.db.getAll(
		'updates',
		IDBKeyRange.bound([new Date(0), id], [new Date(0), id + 1], false, true)
	);
</script>

{#await Promise.all([$page.stuff.db.get('modules', id), updates]) then [module, updates]}
	{#if module}
		<div class="px-2 py-3 bg-white shadow-sm">
			<div class="flex items-center space-x-2 font-functional">
				<img src={module.data.modicon} alt="{module.data.modname} icon" class="w-5 h-5" />
				<span>
					<a
						href={module.data.url}
						class="font-medium underline decoration-2 underline-offset-1 decoration-sky-300 hover:bg-sky-50"
						style:text-decoration-skip-ink="none"
					>
						{module.data.name}
					</a>
				</span>
			</div>
			<div class="space-y-3">
				{#each updates as update ([update.data.id, update.since])}
					{@const timeupdated =
						'timeupdated' in update.data.updates[0] && update.data.updates[0].timeupdated}
					<div
						class="mt-3 rounded space-y-1 py-2 {update.read ? '' : 'px-1 bg-amber-100'}"
						on:click={() => (update.read = true)}
					>
						<p
							class="space-x-2 text-xs flex items-center {update.read
								? 'text-slate-400'
								: 'text-amber-700'}"
						>
							<!-- prettier-ignore -->
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 { update.read ? "text-slate-200" : "text-amber-400" }" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
							</svg>
							<span>
								{#if timeupdated !== false}
									{@const date = new Date(timeupdated * 1000)}
									<time datetime={date.toISOString()}>{format(date)}</time>
								{:else}
									<time datetime={update.since.toISOString()}>{format(update.since)}</time> ~
									<time datetime={update.until.toISOString()}>
										{format(update.until)}
									</time>
								{/if}
							</span>
						</p>
						<p
							class="text-xs text-slate-400 flex items-center space-x-2 {update.read
								? 'text-slate-400'
								: 'text-amber-700'}"
						>
							<!-- prettier-ignore -->
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-200 { update.read ? "text-slate-200" : "text-amber-400" }" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clip-rule="evenodd" />
							</svg>
							<span>
								{update.data.updates.map((e) => e.name).join(' · ')}
							</span>
						</p>
					</div>
				{/each}
			</div>
		</div>
		{#if module.data.description}
			<div class="ml-7 mr-2 mt-2 text-slate-500 [&_p:not(:first-child)]:mt-2 leading-tight">
				{@html module.data.description}
			</div>
		{/if}
	{/if}
{/await}
