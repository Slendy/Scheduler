<script>
	import SchedulePage from '$lib/pages/SchedulePage.svelte';
	import { page } from '$app/stores';
</script>

<SchedulePage environmentDomain={$page.params.environmentDomain} />
