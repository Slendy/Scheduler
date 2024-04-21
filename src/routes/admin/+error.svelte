<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>An error has occurred</title>
</svelte:head>

<div class="p-5">
	<h1>{$page.error?.message || 'An error has occurred'}</h1>
	{#if $page.status === 404}
		<p>Sorry, but the page you requested could not be found.</p>
		<p>Take a look at the <a href="/admin">home page</a> to find what you were looking for.</p>
	{:else}
		<p>An error has occurred, please try again later</p>
	{/if}
</div>
