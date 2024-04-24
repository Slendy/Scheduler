<script lang="ts">
	import { convertTimeToSeconds, createCachedSchedule } from '$lib/shared/schedule';
	import type { Schedule, ScheduleEvent, ScheduleVariation } from '$lib/shared/types';
	import { onMount } from 'svelte';
	import moment, { type unitOfTime } from 'moment';
	import { browser } from '$app/environment';

	export let schedule: Schedule;

	// this should update only whenever schedule changes
	$: cachedSchedule = createCachedSchedule(schedule, scheduleDate);

	function plural(value: number, label: string) {
		if (value == 1) return label;

		return label + 's';
	}

	function getNextEvent(time: Date) {
		if (!browser) {
			cachedSchedule = createCachedSchedule(schedule, scheduleDate);
		}
		let events = cachedSchedule?.events || [];

		if (events.length == 0) {
			return undefined;
		}

		let target = undefined;
		let title = undefined;
		let inProgress = undefined;
		for (let i = 0; i < events.length; i++) {
			if (schedule.variations.length > 0 && !events[i].variations.includes(selectedVariation)) continue;

			if (
				time.getTime() >= events[i].startTimeDate.getTime() &&
				time.getTime() <= events[i].endTimeDate.getTime()
			) {
				inProgress = true;
				target = events[i].endTimeDate;
				title = events[i].name;
			} else if (
				events[i + 1] &&
				time.getTime() >= events[i].endTimeDate.getTime() &&
				time.getTime() <= events[i + 1].startTimeDate.getTime()
			) {
				inProgress = false;
				target = events[i + 1].startTimeDate;
				title = events[i + 1].name;
			}
		}

		if(target === undefined && title === undefined && inProgress == undefined){
			return undefined;
		}

		let exactTime = target?.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
		let curDate = time.getDate() + '/' + time.getMonth() + '/' + time.getFullYear();
		let targetDate = target?.getDate() + '/' + target?.getMonth() + '/' + time.getFullYear();
		if (curDate == targetDate) {
			exactTime = '(at ' + exactTime + ')';
		} else {
			let dateString = target?.toLocaleString('en-US', {
				year: time.getFullYear() !== target?.getFullYear() ? 'numeric' : undefined,
				month: 'long',
				day: 'numeric'
			});
			exactTime = '(' + dateString + ' at ' + exactTime + ')';
		}
		return {
			inProgress,
			target,
			title,
			timeDescription: exactTime
		};
	}

	function setTime() {
		time = customTime || new Date();

		nextEvent = getNextEvent(time);
		if (nextEvent == null) return undefined;

		let currentMoment = moment(time.getTime());
		let targetMoment = moment(nextEvent.target.getTime());

		let duration = moment.duration(targetMoment.diff(currentMoment));

		durations = [];

		for (let component of timeKeys) {
			if (!timeComponents.includes(component)) continue;

			let value = Math.floor(duration.as(component as unitOfTime.Base));

			if (value >= 1 || component == 'second') {
				duration.subtract(value, component);
				durations = [
					...durations,
					{
						id: component,
						value: value
					}
				];
			}
		}
	}

	function updateFrame() {
		setTime();

		requestAnimationFrame(updateFrame);
	}

	let nextEvent: any;
	let durations: any[];

	onMount(() => {
		let timer = requestAnimationFrame(updateFrame);

		return () => {
			cancelAnimationFrame(timer);
		};
	});

	enum TimeComp {
		Milliseconds,
		Seconds,
		Minutes,
		Hours,
		Days,
		Months,
		Years
	}

	const timeKeys = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'] as const;
	type TimeComponent = (typeof timeKeys)[number];

	export let timeComponents: TimeComponent[] = ['year', 'month', 'day', 'hour', 'minute', 'second'];
	// export let hiddenLabels: TimeComponent[] = ["millisecond"];
	export let selectedVariation: string;
	export let customTime: Date | undefined = undefined;
	export let time: Date | undefined = customTime;
	export let scheduleDate: Date = new Date();

	setTime();
</script>

<div class="vertical-center no-select">
	<div class="event-wrapper">
		{#if nextEvent != null}
			<h1 class="header" id="event-name">{nextEvent?.title || ''}</h1>
			<h1 class="header event-text" id="event-status">
				{nextEvent?.inProgress ? 'ends in' : 'begins in'}
			</h1>
		{:else}
			<h1 class="header" id="event-name">No more events</h1>
			<br class="event-break" />
			<div class="timer-wrapper">
				<span class="timer-label timer">Check back later</span>
			</div>
		{/if}
	</div>

	{#if nextEvent != null}
		<br class="event-break" />
		{#each durations as duration}
			{#key duration.id == 'millisecond' ? duration.value : duration.id}
				<div class="timer-wrapper" id={duration.id}>
					<span class="timer-number timer" class:timer={duration.id != 'millisecond'}
						>{duration.value}</span
					>
					{#if duration.id != 'millisecond'}
						<span class="timer-label timer">{plural(duration.value, duration.id)}</span>
					{/if}
				</div>
			{/key}
		{/each}
	{/if}

	{#if nextEvent != null}
		<br class="timer-break" />
		<small class="timer-date" id="time">{nextEvent.timeDescription}</small>
	{/if}
</div>
