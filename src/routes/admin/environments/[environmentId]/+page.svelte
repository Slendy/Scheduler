<script lang="ts">
	import { run } from 'svelte/legacy';

	import DeleteEnvironmentModal from '$lib/components/modal/DeleteEnvironmentModal.svelte';
	import DeleteScheduleModal from '$lib/components/modal/DeleteScheduleModal.svelte';
	import OneThirdHeader from '$lib/components/OneThirdHeader.svelte';
	import ScheduleCard from '$lib/components/schedule/ScheduleCard.svelte';
	import { dayjs } from '$lib/shared/dayjs.js';
	import { getActiveSchedule } from '$lib/shared/schedule.js';

	let { data } = $props();

	let deleteScheduleId: string = $state('');
	let deleteScheduleName: string = $state('');

	let scheduleDisplayMode: 'grid' | 'column' = $state('grid');

	let activeSchedule = $derived(getActiveSchedule(
		data.environment.schedules,
		dayjs.tz(undefined, data.environment.timeZone),
		data.environment.timeZone
	));

	// sort schedules by active first, then most recently updated
	run(() => {
		data.environment.schedules.sort((a: any, b: any) => {
			let timeA = new Date(a.updatedAt);
			let timeB = new Date(b.updatedAt);

			if (a === activeSchedule?.schedule) {
				return -1;
			}
			if (b === activeSchedule?.schedule) {
				return 1;
			}

			return timeB.getTime() - timeA.getTime();
		});
	});

	//TODO: implement filtering and sorting
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
	{#snippet left()}
		<div >
			<a href="/admin/environments" class="btn btn-secondary float-start m-1 mt-2"> Go back </a>
		</div>
	{/snippet}
	{#snippet right()}
		<div >
			<button
				class="btn btn-danger float-end m-1 mt-2"
				data-bs-toggle="modal"
				data-bs-target="#deleteConfirmationModal"
			>
				Delete environment
			</button>
			<a
				href="/admin/environments/{data.environment._id}/edit"
				class="btn btn-secondary float-end m-1 mt-2"
			>
				Edit environment
			</a>
		</div>
	{/snippet}
</OneThirdHeader>

<button
	class="btn btn-primary"
	onclick={() => {
		scheduleDisplayMode = scheduleDisplayMode == 'column' ? 'grid' : 'column';
	}}>Toggle view mode</button
>

<div class="d-flex justify-content-end mb-3">
	<a
		href="/admin/environments/{data.environment._id}/schedule/new"
		class="btn btn-success float-start m-1 mt-2"
	>
		New schedule
	</a>
	<a
		href="/admin/environments/{data.environment._id}/preview"
		class="btn btn-primary float-start m-1 mt-2"
	>
		Preview environment
	</a>
</div>

{#if data.environment.schedules.length == 0}
	<div class="h-100 d-flex align-items-center justify-content-center">
		<div class="card text-center" style="width: 18rem;">
			<div class="card-body">
				<p class="card-text">There are no schedules in this environment</p>
				<a
					href="/admin/environments/{data.environment._id}/schedule/new"
					class="btn btn-secondary m-1 mt-2"
				>
					Create a schedule
				</a>
			</div>
		</div>
	</div>
{:else}
	<DeleteScheduleModal
		environmentId={data.environment._id}
		bind:scheduleName={deleteScheduleName}
		bind:scheduleId={deleteScheduleId}
	/>
	{#if scheduleDisplayMode == 'grid'}
		<div class="row row-cols-1 row-cols-md-auto g-4">
			{#each data.environment.schedules as schedule (schedule.scheduleId)}
				<ScheduleCard
					environmentId={data.environment._id}
					{...schedule}
					isActive={activeSchedule?.schedule == schedule}
					bind:deleteScheduleId
					bind:deleteScheduleName
				/>
			{/each}
		</div>
	{:else}
		<div class="table-responsive">
			<table class="table">
				<thead>
					<tr>
						<th scope="col">Schedule ID</th>
						<th scope="col">Name</th>
						<th scope="col">Date</th>
						<th scope="col">Events</th>
						<th scope="col">Active</th>
						<th scope="col">Last updated</th>
						<th scope="col">Edit</th>
					</tr>
				</thead>
				<tbody>
					{#each data.environment.schedules as schedule (schedule.scheduleId)}
						<tr>
							<td>{schedule.scheduleId}</td>

							<td>{schedule.name}</td>

							<td>{schedule.scheduleDate || 'Invalid date'}</td>

							<td>{schedule.events.length}</td>

							<td>{activeSchedule?.schedule == schedule}</td>

							<td>{dayjs(schedule.updatedAt).fromNow()}</td>

							<td>
								<button
									style="border: none; padding: 0; outline: inherit; background: none; text-decoration: underline;"
									data-bs-toggle="modal"
									data-bs-target="#edit-user"
								>
									Edit schedule
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/if}
