<script lang="ts">
	import DeleteEnvironmentModal from '$lib/components/DeleteEnvironmentModal.svelte';
	import OneThirdHeader from '$lib/components/OneThirdHeader.svelte';
	import ScheduleCard from '$lib/components/schedule/ScheduleCard.svelte';

	export let data;
</script>

<DeleteEnvironmentModal
	environmentName={data.environment.environmentName}
	environmentId={data.environment._id}
/>

<svelte:head>
	<title>{data.environment.environmentName}</title>
</svelte:head>

<OneThirdHeader>
	{data.environment.environmentName}
	<div slot="left">
		<a
			href="/admin/environments/{data.environment._id}/schedule/new"
			class="btn btn-secondary float-start m-1 mt-2"
		>
			Create schedule
		</a>
	</div>
	<div slot="right">
		<button
			class="btn btn-danger float-end m-1 mt-2"
			data-bs-toggle="modal"
			data-bs-target="#deleteConfirmationModal">Delete environment</button
		>
		<a
			href="/admin/environments/{data.environment._id}/edit"
			class="btn btn-secondary float-end m-1 mt-2">Edit environment</a
		>
	</div>
</OneThirdHeader>

{#if data.environment.schedules.length == 0}
	<div class="h-100 d-flex align-items-center justify-content-center">
		<div class="card text-center" style="width: 18rem;">
			<div class="card-body">
				<p class="card-text">There are no schedules in this environment</p>
				<a
					href="/admin/environments/{data.environment._id}/schedule/new"
					class="btn btn-secondary m-1 mt-2">Create a schedule</a
				>
			</div>
		</div>
	</div>
{:else}
	<div class="row row-cols-1 row-cols-md-4 g-4">
		{#each data.environment.schedules as schedule}
			<ScheduleCard environmentId={data.environment._id} {...schedule} />
		{/each}
	</div>
{/if}
