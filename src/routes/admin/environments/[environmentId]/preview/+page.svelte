<script>
	import SchedulePage from "$lib/pages/SchedulePage.svelte";

    export let data;
</script>

<SchedulePage environmentDomain={data.environment.environmentDomain} bind:data />