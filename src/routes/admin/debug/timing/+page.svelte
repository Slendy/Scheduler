<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { createCachedSchedule, getActiveSchedule, getNextEvent } from '$lib/shared/schedule';
	import { dayjs } from '$lib/shared/dayjs.js';

	let { data } = $props();
	let query = new URLSearchParams($page.url.searchParams.toString());

	let environmentId: string = $state(query.get('environmentId') || '');
	let scheduleId: string = $state(query.get('scheduleId') || '');

	let environment = data.environmentSerialized
		? JSON.parse(data.environmentSerialized || '')
		: undefined;
	let schedule = data.environmentSerialized ? JSON.parse(data.scheduleSerialized || '') : undefined;

	let time: string | undefined = $state();
	let scheduleDate: string = $state(new Date().toISOString().split('T')[0]);
	let cachedSchedule = $derived(
		createCachedSchedule(schedule, dayjs.tz(scheduleDate, environment?.timeZone ?? 'UTC'))
	);
</script>

<ErrorAlert message={data.error} />

<form
	onsubmit={(e) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		query.set('environmentId', environmentId);
		query.set('scheduleId', scheduleId);

		goto('?' + query.toString(), { invalidateAll: true });
	}}
>
	<div>
		<label for="env-id">Environment ID</label>
		<input type="text" bind:value={environmentId} id="env-id" />
	</div>
	<div>
		<label for="schedule-id">Schedule ID</label>
		<input type="text" bind:value={scheduleId} id="schedule-id" />
	</div>

	<button type="submit" class="btn btn-secondary">Update</button>
</form>

<pre>{JSON.stringify(data)}</pre>
{#if environment != null}
	<div>
		<span
			>Active schedule: {getActiveSchedule(environment.schedules, dayjs(time), 'America/Chicago')
				?.schedule?.name || 'no schedule'}</span
		>
	</div>
{/if}
{#if schedule != null}
	<div>
		<label for="time-picker">Schedule date</label>
		<input type="date" id="time-picker" bind:value={scheduleDate} />
	</div>
	<div>
		<label for="time-picker">Time to check with</label>
		<input type="datetime-local" id="time-picker" bind:value={time} />
	</div>

	<div class="m-3 text-start">
		<pre>
			Schedule next event: {JSON.stringify(
				getNextEvent(cachedSchedule, new Date(time || '0'), []) || 'no event'
			)}
		</pre>
	</div>
{/if}
