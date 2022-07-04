<script lang="ts">
    import { page } from '$app/stores';

    import { currentCourseId, modules, sections } from '$lib/stores/module';
    import { formatRelative } from 'date-fns';
    import { vi } from 'date-fns/locale';

    $: $currentCourseId = parseInt($page.params.courseid);

    $: console.log($sections);

    const format = (date: Date) =>
        formatRelative(date, new Date(), { locale: vi });
</script>

{#each $modules as { section: { section }, moduleUpdates }}
    <h3
        class="mt-6 font-bold text-sky-700 bg-slate-100 py-1 px-2 border-b-2 border-slate-300"
    >
        {section.name}
    </h3>
    <ul class="mt-3 space-y-2">
        {#each moduleUpdates as { module: { module }, updates }}
            <li>
                <p class="flex items-center space-x-1">
                    <img src={module.modicon} class="h-5 w-5" alt="icon" /><a
                        href={module.url}
                        class="underline decoration-slate-300 underline-offset-1"
                        target="_blank"
                    >
                        {module.name}
                    </a>
                </p>
                {#each updates as { update, read, since, until }}
                    {@const config = update.updates[0]}
                    <button
                        class="w-full rounded mb-6 mt-2 text-left"
                        class:shadow={!read}
                        on:click={() => (read = !read)}
                    >
                        <p
                            class="text-xs text-slate-400 py-1 px-2 mt-1 rounded-t"
                            class:bg-amber-500={!read}
                            class:text-white={!read}
                        >
                            {#if config && 'timeupdated' in config}
                                tại {format(
                                    new Date(config.timeupdated * 1000)
                                )}
                            {:else}
                                vào khoảng {format(since)} ~ {format(until)}
                            {/if}
                        </p>
                        <p
                            class="text-xs py-1 px-2 text-slate-400 rounded-b"
                            class:bg-amber-50={!read}
                            class:text-amber-800={!read}
                        >
                            update field: {update.updates
                                .map((x) => x.name)
                                .join(' · ')}
                        </p>
                    </button>
                {/each}
                {#if module.description}
                    <p class="mt-4">{@html module.description}</p>
                {/if}
            </li>
        {/each}
    </ul>
{/each}
