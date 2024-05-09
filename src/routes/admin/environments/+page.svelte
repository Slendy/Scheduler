<script lang="ts">
	import Header from '../../../lib/components/Header.svelte';
	import EnvironmentCard from '$lib/components/EnvironmentCard.svelte';
	import PlaceholderCard from '$lib/components/PlaceholderCard.svelte';

	export let data;
</script>

<Header>Environments</Header>

{#await data.environments then environments}
	<div class="mb-3">
		<h4 class="mb-3">There are {environments.length} environments</h4>
		<a href="/admin/environments/add" class="btn btn-secondary">Add new environment</a>
	</div>
{/await}

{#await data.environments}
	<p class="placeholder-wave">
		<span class="placeholder col-3"></span>
	</p>
	<button class="btn btn-secondary disabled placeholder placeholder-wave col-2 mb-3"></button>
	<div class="row row-cols-sm-auto row-cols-1 g-4">
		<PlaceholderCard />
		<PlaceholderCard />
		<PlaceholderCard />
	</div>
{:then environments}
	<div class="row row-cols-sm-auto row-cols-1 g-4">
		{#each environments as environment}
			<EnvironmentCard
				environmentId={environment._id}
				environmentDomain={environment.environmentDomain}
				environmentName={environment.environmentName}
				totalSchedules={environment.totalSchedules || 0}
			/>
		{/each}
	</div>
{:catch error}
	<p>Error: {error.message}</p>
{/await}
