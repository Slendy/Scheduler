<script>
	import SchedulePage from '$lib/pages/SchedulePage.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<svelte:head>
    <link rel="shortcut icon" href="/{$page.params.environmentDomain}/favicon.ico" />
</svelte:head>

<SchedulePage environmentDomain={$page.params.environmentDomain} bind:data />
