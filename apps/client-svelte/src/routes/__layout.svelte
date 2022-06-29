<script lang="ts">
    import { machine, setInitService } from '$lib/machines/initialization';
    import { useMachine } from '@xstate/svelte';

    const service = useMachine(machine);

    setInitService(service);

    const initState = service.state;
</script>

{#if $initState.matches('Database, token with info') || $initState.matches('Database with no token')}
    <slot />
{:else}
    <div>
        {$initState.value} - {JSON.stringify($initState.context)}
    </div>
{/if}
