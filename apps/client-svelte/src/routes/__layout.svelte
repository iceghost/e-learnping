<script lang="ts">
    import { machine, setInitService } from '$lib/machines/initialization';
    import { useMachine } from '@xstate/svelte';
    import { session } from '$app/stores';

    const service = useMachine(machine);
    const initState = service.state;

    setInitService(service);

    $session;

    $: {
        const db = $initState.context.db;
        const token = $initState.context.token;
        const info = $initState.context.info;
        if (db && token && info) {
            session.set({ db, token, info });
        }
    }
</script>

<!-- If initialization succeeded, or user is unauthenticated -->
{#if $initState.matches('Done') || $initState.matches('Database with no token')}
    <slot />
{:else}
    <div>
        {$initState.value}
    </div>
{/if}
