<script lang="ts">
	import SchedulePage from '$lib/pages/SchedulePage.svelte';

	let { data = $bindable() } = $props();
</script>

<SchedulePage environmentDomain={data.environment.environmentDomain} bind:data />
