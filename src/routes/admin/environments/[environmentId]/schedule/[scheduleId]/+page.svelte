<script lang="ts">
	import OneThirdHeader from '$lib/components/OneThirdHeader.svelte';
	import RadioSelector from '$lib/components/RadioSelector.svelte';
	import ScheduleView from '$lib/components/schedule/ScheduleView.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';

	export let data;

	let selectedVariation: string = '';
	let selectedTime = 'current-time';
	let selectedWindow = 'events';
	let timeValue: any = '00:00:00';
	$: console.log(timeValue);
	$: customTime =
		selectedTime == 'current-time'
			? undefined
			: new Date(new Date(timeValue).setDate(new Date().getDate()));
</script>

<OneThirdHeader>
	{data.schedule.name}
	<a
		href="/admin/environments/{data.environment._id}"
		class="btn btn-secondary float-start m-1 mt-2"
		slot="left"
	>
		Go back
	</a>
	<div slot="right">
		<button
			class="btn btn-danger float-end m-1 mt-2"
			data-bs-toggle="modal"
			data-bs-target="#deleteConfirmationModal">Delete schedule</button
		>
		<a
			href="/admin/environments/{data.environment._id}/schedule/{data.schedule.scheduleId}/edit"
			class="btn btn-secondary float-start m-1 mt-2"
		>
			Edit schedule
		</a>
	</div>
</OneThirdHeader>
<div class="text-center mb-3">
	<h4>Preview mode</h4>
	<RadioSelector
		name="window-select"
		bind:value={selectedWindow}
		options={[
			{ label: 'Event list', id: 'events' },
			{ label: 'Countdown', id: 'countdown' }
		]}
	/>
</div>

{#if selectedWindow === 'events'}
	<div class="d-flex">
		<ScheduleEventTable schedule={data.schedule} {selectedVariation} transition={false} />
	</div>
{:else}
	<div class="text-center mb-3">
		<h4>Time select</h4>
		<RadioSelector
			name="time-select"
			bind:value={selectedTime}
			options={[
				{ label: 'Current time', id: 'current-time' },
				{ label: 'Custom time', id: 'custom-time' }
			]}
		/>
		<div class="m-3">
			{#if selectedTime == 'custom-time'}
				<input type="time" step="1" class="" bind:value={timeValue} />
			{/if}
		</div>
	</div>
	<div class="d-flex border border-secondary p-2 rounded-3">
		<ScheduleView schedule={data.schedule} {selectedVariation} bind:customTime />
	</div>
{/if}
