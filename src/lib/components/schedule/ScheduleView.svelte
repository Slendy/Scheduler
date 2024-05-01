<script lang="ts">
	import { createCachedSchedule, getNextEvent } from '$lib/shared/schedule';
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

	function getAndFormatNextEvent(time: Date) {
		if (!browser) {
			cachedSchedule = createCachedSchedule(schedule, scheduleDate);
		}

		if (cachedSchedule == null) {
			console.error('Cached schedule is undefined');
			return undefined;
		}

		const { target, title, inProgress } = getNextEvent(cachedSchedule, time, selectedVariations);

		if (target === undefined && title === undefined && inProgress == undefined) {
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

		nextEvent = getAndFormatNextEvent(time);
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
	export let selectedVariations: string[];
	export let customTime: Date | undefined = undefined;
	export let time: Date | undefined = customTime;
	export let scheduleDate: Date = new Date();

	setTime();
</script>

<div class="countdown-container transition">
	<div class="countdown-wrapper">
		<div class="header-container">
			<div class="header-wrapper">
				<div class="event-wrapper">
					{#if nextEvent != null}
						<h1 class="header">{nextEvent?.title || ''}</h1>
						<h1 class="header event-text">{nextEvent?.inProgress ? 'ends in' : 'begins in'}</h1>
					{:else}
						<h1 class="header">No more events</h1>
						<br class="event-break" />
						<div>
							<span class="timer-label timer">Check back later</span>
						</div>
					{/if}
				</div>
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
				<span class="timer-date" id="time">{nextEvent.timeDescription}</span>
				<br class="timer-break" />
			{/if}
		</div>
	</div>
</div>

<style>
	.countdown-container {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;

		user-select: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-o-user-select: none;
	}

	.header-container {
		text-align: center;
		display: block;
	}

	.header-wrapper {
		margin-bottom: 1.2rem;
	}

	.event-wrapper {
		display: inline-block;
	}

	.header {
		color: var(--schedule-text-color);
		text-align: center;
		/* font-size: var(--large-font-size); */
		font-size: 700%;
		font-size: 9.5vmin;
		font-family: 'Open Sans', 'Helvetica', serif;
		display: inherit;
		margin: 0;
		line-height: 1em;
	}

	.timer {
		color: var(--schedule-text-color);
		text-align: center;
		/* font-size: var(--large-font-size); */
		font-size: 700%;
		font-size: 9.5vmin;
		font-family: 'Open Sans', 'Helvetica', serif;
	}

	.timer-date {
		color: var(--schedule-text-color);
		font-family: 'Open Sans', 'Helvetica', serif;
		/* font-size: var(--small-font-size); */
		font-size: 200%;
		font-size: 4.1vmin;
		font-weight: 400;
	}

	.timer-wrapper {
		display: inline-block;
		touch-action: manipulation;
	}

	.timer-label {
		display: inherit;
		font-weight: 100;
		margin-right: 0.5em;
	}

	.timer-number {
		display: inherit;
		font-weight: bold;
		padding-left: 0.5em;
		padding-right: 0.35em;
	}

	.event-text {
		font-weight: 300;
		padding: 0.2em;
	}

	.event-break {
		display: block;
		content: '';
		margin-top: calc(1em + 5vh);
	}

	.transition {
		-moz-transition: all 0.2s ease-in-out;
		-o-transition: all 0.2s ease-in-out;
		-webkit-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
	}
</style>
