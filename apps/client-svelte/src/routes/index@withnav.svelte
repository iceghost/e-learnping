<script lang="ts">
    import { updateCategory } from '$lib/stores/category';
    import { courses } from '$lib/stores/course';

    let editMode = false;
</script>

{#each $courses as { category: { hidden, coursecategory, name }, courses }}
    {#if !hidden || editMode}
        <h3
            class="font-bold text-sky-800 py-0.5 px-2 mt-3 mb-1 border-b-2 border-slate-300 bg-slate-100"
        >
            {#if editMode}
                <label>
                    <input
                        type="checkbox"
                        checked={!hidden}
                        on:click={(e) => {
                            updateCategory(
                                coursecategory,
                                !e.currentTarget.checked
                            );
                            hidden = !e.currentTarget.checked;
                        }}
                    />
                    {@html name}
                </label>
            {:else}
                {@html name}
            {/if}
        </h3>
    {/if}
    {#if !editMode && !hidden}
        <ul class="space-y-2">
            {#each courses as { course, nameParts: { class: c, code, name } }}
                <li>
                    <p
                        class="underline decoration-slate-300 underline-offset-1"
                    >
                        <a href="/course/{course.id}">{@html name}</a>
                    </p>
                    {#if code && c}
                        <p class="uppercase text-xs text-sky-600">
                            {code} · {c}
                        </p>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
{/each}

<div class="sticky bottom-5 flex justify-end pointer-events-none">
    <button
        class="w-12 h-12 bg-sky-600 shadow-lg flex items-center justify-center text-white rounded-full pointer-events-auto"
        title={!editMode ? 'Ẩn những môn không cần thiết' : 'Hoàn thành'}
        on:click={() => (editMode = !editMode)}
    >
        {#if !editMode}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        {:else}
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        {/if}
    </button>
</div>
