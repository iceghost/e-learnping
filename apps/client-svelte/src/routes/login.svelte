<script lang="ts">
    import initialization from '$lib/machines/initialization';
    import { useMachine } from '@xstate/svelte';

    const { state: initState, send: initSend } = useMachine(initialization);
</script>
