<script lang="ts">
	import DeleteEnvironmentModal from '$lib/components/modal/DeleteEnvironmentModal.svelte';
	import DeleteScheduleModal from '$lib/components/modal/DeleteScheduleModal.svelte';
	import OneThirdHeader from '$lib/components/OneThirdHeader.svelte';
	import ScheduleCard from '$lib/components/schedule/ScheduleCard.svelte';
	import { dayjs } from '$lib/shared/dayjs.js';
	import { getActiveSchedule } from '$lib/shared/schedule.js';

	export let data;

	let deleteScheduleId: string = '';
	let deleteScheduleName: string = '';

	$: activeSchedule = getActiveSchedule(data.environment.schedules, dayjs.tz(undefined, data.environment.timeZone), data.environment.timeZone);

	// sort schedules by active first, then most recently updated
	$: data.environment.schedules.sort((a: any, b: any) => {
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
	<div slot="left">
		<a href="/admin/environments" class="btn btn-secondary float-start m-1 mt-2"> Go back </a>
	</div>
	<div slot="right">
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
</OneThirdHeader>

<div class="d-flex mb-3" style="margin-top: -3rem">
	<div class="text-center m-auto">
		<a
			href="/admin/environments/{data.environment._id}/preview"
			class="btn btn-primary float-start m-1 mt-2"
		>
			Preview environment
		</a>
	</div>
</div>

<div class="d-flex mb-3">
	<div class="text-center m-auto">
		<a
			href="/admin/environments/{data.environment._id}/schedule/new"
			class="btn btn-secondary float-start m-1 mt-2"
		>
			Create schedule
		</a>
	</div>
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
	<div class="row row-cols-1 row-cols-md-auto g-4">
		{#each data.environment.schedules as schedule}
			<ScheduleCard
				environmentId={data.environment._id}
				{...schedule}
				isActive={activeSchedule?.schedule == schedule}
				bind:deleteScheduleId
				bind:deleteScheduleName
			/>
		{/each}
	</div>
{/if}
