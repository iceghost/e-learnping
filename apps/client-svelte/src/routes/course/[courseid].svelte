<script lang="ts">
    import { session, page } from '$app/stores';

    async function modulesLoader() {
        let cursor = await $session.db
            .transaction('sections')
            .store.index('by-courseid')
            .openCursor(parseInt($page.params.courseid));

        const sections = [];

        while (cursor) {
            sections.push(cursor.value.section);
            cursor = await cursor.continue();
        }

        return await Promise.all(
            sections.map(async (section) => {
                let cursor = await $session.db
                    .transaction('modules')
                    .store.index('by-sectionid')
                    .openCursor(section.id, 'prev');

                const modules = [];

                while (cursor) {
                    modules.push(cursor.value.module);
                    cursor = await cursor.continue();
                }

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
        <p>{section.name}</p>
        <ul>
            {#each modules as module}
                <li>
                    <p>{module.name}</p>
                    {#if module.description}
                        <p>{@html module.description}</p>
                    {/if}
                </li>
            {/each}
        </ul>
    {/each}
{/await}
