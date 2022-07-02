<script lang="ts">
    import { session, page } from '$app/stores';

    async function modulesLoader() {
        let sections = await $session.db
            .transaction('sections')
            .store.index('by-courseid')
            .getAll(parseInt($page.params.courseid));

        return await Promise.all(
            sections.map(async ({ section }) => {
                let modules = (
                    await $session.db
                        .transaction('modules')
                        .store.index('by-sectionid')
                        .getAll(section.id)
                ).map((module) => module.module);

                return {
                    section,
                    modules,
                };
            })
        );
    }
</script>

{#await modulesLoader() then sections}
    {#each sections as { section, modules }}
        <h3
            class="mt-6 font-bold text-sky-700 bg-slate-100 py-1 px-2 border-b-2 border-slate-300"
        >
            {section.name}
        </h3>
        <ul class="mt-3 space-y-2">
            {#each modules as module}
                <li>
                    <p class="flex items-center space-x-1">
                        <img
                            src={module.modicon}
                            class="h-5 w-5"
                            alt="icon"
                        /><a
                            href={module.url}
                            class="underline decoration-slate-300 underline-offset-1"
                            target="_blank"
                        >
                            {module.name}
                        </a>
                    </p>
                    {#if module.description}
                        <p class="mt-4">{@html module.description}</p>
                    {/if}
                </li>
            {/each}
        </ul>
    {/each}
{/await}
