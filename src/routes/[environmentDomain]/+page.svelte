<script>
	import SchedulePage from '$lib/pages/SchedulePage.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<SchedulePage environmentDomain={$page.params.environmentDomain} bind:data />
