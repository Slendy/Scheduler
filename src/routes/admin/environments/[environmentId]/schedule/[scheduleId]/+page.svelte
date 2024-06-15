<script lang="ts">
	import OneThirdHeader from '$lib/components/OneThirdHeader.svelte';
	import RadioSelector from '$lib/components/RadioSelector.svelte';
	import ScheduleCountdown from '$lib/components/schedule/ScheduleCountdown.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';
	import DeleteScheduleModal from '$lib/components/modal/DeleteScheduleModal.svelte';
	import ScheduleEnableToggle from '$lib/components/schedule/ScheduleEnableToggle.svelte';
	import { dayjs } from '$lib/shared/dayjs.js';
	import { getActiveSchedule, getLastEvent } from '$lib/shared/schedule.js';

	export let data;

	let allVariations = data.schedule.variations
		.map((v: any) => v.options)
		.reduce((prev: any, cur: any) => [...prev, ...cur], []);
	//TODO: this should be user selectable
	let selectedVariations: string[] = [];
	let selectedTime = 'current-time';
	let selectedWindow = 'events';
	let timeValue: any = '00:00:00';
	let customTime: Date | undefined;
	$: {
		if (selectedTime === 'current-time') {
			customTime = undefined;
		} else {
			let time = timeValue.split(':');

			let dateTime = dayjs()
				.set('hour', time[0] || null)
				.set('minute', time[1] || null)
				.set('second', time[2] || null)
				.startOf('millisecond');

			customTime = dateTime.toDate();
		}
	}
	let scheduleWithNoDate: any;

	let isScheduleActive = getActiveSchedule(data.environment.schedules, dayjs(null, data.environment.timeZone), data.environment.timeZone)?.schedule.scheduleId == data.schedule.scheduleId;

	$: {
		const { scheduleDate, ...rest } = data.schedule;
		scheduleWithNoDate = rest;
		
		let curTime = dayjs(customTime, data.environment.timeZone);
		let lastEvent = getLastEvent(data.schedule, curTime);
		if(lastEvent != null && curTime.isAfter(lastEvent as any)){
			curTime = curTime.add(1, 'day');	
		}
		// get today's date in yyyy-mm-dd format
		scheduleWithNoDate.scheduleTimeZone = data.environment.timeZone;
		scheduleWithNoDate.scheduleDate = curTime.toISOString();
	}
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
			data-bs-target="#scheduleDeleteConfirmation">Delete schedule</button
		>
		<a
			href="/admin/environments/{data.environment._id}/schedule/{data.schedule.scheduleId}/edit"
			class="btn btn-secondary float-start m-1 mt-2"
		>
			Edit schedule
		</a>
	</div>
</OneThirdHeader>

<DeleteScheduleModal
	environmentId={data.environment._id}
	scheduleId={data.schedule.scheduleId}
	scheduleName={data.schedule.name}
/>

<div class="text-center mb-3">
	<ScheduleEnableToggle
		environmentId={data.environment._id}
		scheduleId={data.schedule.scheduleId}
		enabled={data.schedule.enabled}
		active={isScheduleActive}
	/>
</div>

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
		<ScheduleEventTable
			schedule={scheduleWithNoDate}
			selectedVariations={allVariations}
			transition={false}
			limitHeight={false}
		/>
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
		<ScheduleCountdown
			schedule={scheduleWithNoDate}
			selectedVariations={allVariations}
			bind:customTime
		/>
	</div>
{/if}
