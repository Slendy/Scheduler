<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data;
</script>

<Header>Scheduler</Header>

{#await data.stats}
	<p class="placeholder-wave">
		<span class="placeholder col-6"></span>
	</p>
{:then stats}
	<h3>Running {stats.totalEnvironments} environments with {stats.totalUsers} users</h3>
{:catch error}
	<p>an error has occurred: {error.message}</p>
{/await}
