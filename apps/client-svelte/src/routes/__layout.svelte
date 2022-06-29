<script lang="ts">
    import { setInitContext } from '$lib/machines/initialization';

    const initService = setInitContext();

    const initState = initService.state;
</script>
