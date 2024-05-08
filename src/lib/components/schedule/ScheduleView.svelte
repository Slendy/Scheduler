<script lang="ts">
	import { createCachedSchedule, getNextEvent } from '$lib/shared/schedule';
	import type { Schedule, ScheduleEvent, ScheduleVariation } from '$lib/shared/types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { dayjs } from '$lib/shared/dayjs';

	export let schedule: Schedule;

	// this should update only whenever schedule changes
	$: cachedSchedule = createCachedSchedule(schedule, scheduleDate);

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

	function plural(value: number, label: string) {
		if (value == 1) return label;

		return label + 's';
	}

	function getAndFormatNextEvent(time: Date) {
		if (!browser || cachedSchedule == null) {
			cachedSchedule = createCachedSchedule(schedule, scheduleDate);
		}

		let next = getNextEvent(cachedSchedule, time, selectedVariations);
		if (next == null) {
			return undefined;
		}

		const { target, title, inProgress } = next;

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

		let currentMoment = dayjs(time.getTime());
		let targetMoment = dayjs(nextEvent.target.getTime()).startOf('millisecond');

		let duration = dayjs.duration(targetMoment.diff(currentMoment));

		durations = [];

		for (let component of timeKeys) {
			if (!timeComponents.includes(component)) continue;

			let value = Math.floor(duration.as(component));

			if (value >= 1 || component == 'second') {
				duration = duration.subtract(value, component);
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

	export let nextEvent: any;
	let durations: any[];

	onMount(() => {
		let timer = requestAnimationFrame(updateFrame);

		return () => {
			cancelAnimationFrame(timer);
		};
	});

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
						<div class="placeholder-wave">
							<div class="placeholder placeholder"></div>
						</div>
						<br class="event-break" />
						<div class="placeholder-wave">
							<span class="placeholder placeholder-large"></span>
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
			{:else}
				<br class="event-break" />
				<div class="timer-wrapper">
					<div class="placeholder-wave">
						<div class="placeholder placeholder-small"></div>
					</div>
				</div>
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

	.countdown-wrapper {
		margin-bottom: 2.85em;
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
		font-weight: 700;
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
		margin-top: calc(1em + 4.8vh);
	}

	.transition {
		-moz-transition: all 0.2s ease-in-out;
		-o-transition: all 0.2s ease-in-out;
		-webkit-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
	}

	.placeholder {
		display: inline-block;
		width: 60vmin;
		opacity: 0.1;
		min-height: 10vmin;
		vertical-align: middle;
		background-color: var(--schedule-text-color);
		border-radius: .5em;
	}

	.placeholder-small {
		width: 30vmin;
	}

	.placeholder-large {
		width: 90vmin;
	}

	.placeholder-wave {
		-webkit-mask-image: linear-gradient(130deg, #000 55%, rgba(165, 165, 165, 0.8) 75%, #000 95%);
		mask-image: linear-gradient(130deg, #000 55%, rgba(0, 0, 0, 0.8) 75%, #000 95%);
		-webkit-mask-size: 200% 100%;
		mask-size: 200% 100%;
		animation: placeholder-wave 1s linear infinite;
	}

	@keyframes placeholder-wave {
		100% {
			mask-position: -200% 0%;
		}
	}

	@media only screen and (max-width: 500px) {
		.header,
		.timer {
			font-size: 6vmin;
		}
	}

	@media only screen and (min-width: 2000px) {
		.header,
		.timer {
			font-size: 3.5vmax;
		}
	}

	@media only screen and (max-height: 420px) {
		.header,
		.timer {
			font-size: 10vmin;
		}

		.countdown-container {
			width: 90%;
			font-size: 5vmin;
		}
	}
</style>
