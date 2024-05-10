<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { createCachedSchedule, getActiveSchedule, getNextEvent } from '$lib/shared/schedule';
	import { dayjs } from '$lib/shared/dayjs.js';

	export let data;
	let query = new URLSearchParams($page.url.searchParams.toString());

	let environmentId: string = query.get('environmentId') || '';
	let scheduleId: string = query.get('scheduleId') || '';

	let environment = data.environmentSerialized
		? JSON.parse(data.environmentSerialized || '')
		: undefined;
	let schedule = data.environmentSerialized ? JSON.parse(data.scheduleSerialized || '') : undefined;

	$: cachedSchedule = createCachedSchedule(schedule, dayjs.tz(scheduleDate, environment.timeZone));

	let time: string;
	let scheduleDate: string = new Date().toISOString().split("T")[0];
</script>

<ErrorAlert message={data.error} />

<form
	on:submit={(e) => {
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
		<span>Active schedule: {getActiveSchedule(environment.schedules, dayjs(time), 'America/Chicago')?.schedule?.name || 'no schedule'}</span>
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

	<div class="text-start m-3">
		<pre>
			Schedule next event: {JSON.stringify(getNextEvent(cachedSchedule, new Date(time), []) || 'no event')}
		</pre>
	</div>
{/if}
