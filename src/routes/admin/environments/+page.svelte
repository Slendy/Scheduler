<script lang="ts">
	import Header from '../../../lib/components/Header.svelte';
	import EnvironmentCard from '$lib/components/EnvironmentCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Header>Environments</Header>

{#await data.environments then environments}
	<div class="mb-3">
		<h4 class="mb-3">There are {environments.length} environments</h4>
		<a href="/admin/environments/add" class="btn btn-secondary">Add new environment</a>
	</div>
{/await}

<div class="row row-cols-sm-auto row-cols-1 g-4">
	{#await data.environments}
		<p>loading...</p>
	{:then environments}
		{#each environments as environment}
			<EnvironmentCard
				environmentId={environment._id}
				environmentDomain={environment.environmentDomain}
				environmentName={environment.environmentName}
				totalSchedules={environment.schedules.length || 0}
			/>
		{/each}
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
