<script lang="ts">
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';
	import ScheduleCountdown from '$lib/components/schedule/ScheduleCountdown.svelte';
	import { dayjs } from '$lib/shared/dayjs.js';
	import { hashObject } from '$lib/shared/hash.js';
	import { getLastEvent } from '$lib/shared/schedule.js';
	import { onMount } from 'svelte';

	function slugify(input: string) {
		return input
			.replaceAll(/[^a-zA-Z0-9 ]+/g, '')
			.split(' ')[0]
			.toLowerCase();
	}

	let nextSchedule: any;
	let nextScheduleHash: string;

	export let environmentDomain: string;

	async function preloadNextSchedule() {
		if (!$page.data.schedule) return;
		let lastEvent = getLastEvent($page.data.schedule, dayjs($page.data.schedule.scheduleDate));
		if (!lastEvent) return;
		let timeUntilEnd = lastEvent.unix() - dayjs().unix();
		console.log(timeUntilEnd);
		console.log((lastEvent.unix() + 1) * 1000);

		// if there are 5 minutes left in the schedule then try and prefetch the next schedule
		if (timeUntilEnd < 5) {
			let startOfNext = (lastEvent.unix() + 1) * 1000;
			let response = await fetch(
				`/api/v1/environments/domain/${environmentDomain}/schedule/time/${startOfNext}`,
				{
					headers: {
						'If-None-Match': nextScheduleHash
					}
				}
			);
			if (!response.ok) return;

			nextSchedule = await response.json();
			nextScheduleHash = await hashObject(nextSchedule);
		}
	}

	function onEventChange(oldEvent: any, newEvent: any) {
		if (oldEvent && !newEvent && nextSchedule) {
			$page.data.schedule = nextSchedule;
			$page.data.scheduleHash = nextScheduleHash;
			nextSchedule = undefined;
			nextScheduleHash = '';
		}
	}

	async function requestNewSchedule() {
		let response = await fetch(
			`/api/v1/environments/domain/${environmentDomain}/schedule/current`,
			{
				headers: {
					'If-None-Match': $page.data.scheduleHash
				}
			}
		);
		if (!response.ok) return;

		$page.data.schedule = await response.json();
		$page.data.scheduleHash = await hashObject($page.data.schedule);
	}

	onMount(() => {
		if (!browser) {
			return;
		}

		// check for schedule updates every minute
		let interval = setInterval(async () => {
			await preloadNextSchedule();
			await requestNewSchedule();
		}, 60 * 1000);

		for (let variation of $page.data.schedule.variations) {
			let queryParam = $page.url.searchParams.get(slugify(variation.name)) || '';
			let urlOption =
				variation.options.find((o: any) => slugify(o) === slugify(queryParam)) ||
				variation.options[0];

			selectedVariations = [...selectedVariations, urlOption];
		}
		return () => {
			clearInterval(interval);
		};
	});

	let selectedVariations: string[] = [];
	let displayTable: boolean = false;
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<body class="transition"></body>

<div class="toggle">
	<DarkModeToggle />
</div>

<div class="schedule-container transition">
	<ScheduleCountdown schedule={$page.data.schedule} bind:selectedVariations {onEventChange} />
	<footer class="schedule-footer refresh" style="display:none" id="refresh">
		<span> A newer version is available. Please</span>
		<a id="update" class="update"> refresh this page</a>
		<span> to activate it.</span>
	</footer>
	<div class="schedule-footer transition" id="transition-footer">
		<span>
			Made by
			<a href="https://github.com/Slendy" style="text-decoration: underline; font-weight: normal">
				josh
			</a> |
		</span>
		<div id="footer-selectors" style="display: inline">
			{#each $page.data.schedule.variations as variation}
				{#each variation.options as option}
					<button
						class="footer-button footer-selector transition"
						class:selected={selectedVariations.includes(option)}
						on:click={() => {
							// remove other selected options from this variation
							selectedVariations = selectedVariations.filter((v) => !variation.options.includes(v));

							$page.url.searchParams.set(slugify(variation.name), slugify(option));

							replaceState($page.url, $page.state);

							selectedVariations.push(option);
						}}>{option}</button
					>
					<span> | </span>
				{/each}
			{/each}
		</div>
		<button
			class="footer-button transition"
			id="toggle-schedule"
			on:click={() => (displayTable = !displayTable)}
		>
			View schedule
		</button>
		<span class="footer-text" id="footer-right"></span>
	</div>
</div>
{#if displayTable}
	<div class="table-container">
		<ScheduleEventTable schedule={$page.data.schedule} bind:selectedVariations />
	</div>
{/if}

<style>
	body {
		background: var(--schedule-bg-color);
		touch-action: manipulation;
		margin: 0;
	}

	.transition {
		-moz-transition: all 0.2s ease-in-out;
		-o-transition: all 0.2s ease-in-out;
		-webkit-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
	}

	.schedule-container {
		min-height: 100vh;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.table-container {
		display: block;
		position: absolute;
		top: 46.25%;
		left: 50%;
		width: 70%;
		max-height: 90%;
		text-align: center;
		transform: translate(-50%, -50%);
	}

	.toggle {
		fill: var(--schedule-text-color);
		position: absolute;
		left: .5em;
		top: .5em;
		padding: 0;
		cursor: pointer;
	}

	a:link,
	a:visited,
	a:hover,
	a:active {
		color: var(--schedule-text-color);
		font-weight: bold;
		text-decoration: none;
	}

	.schedule-footer {
		color: var(--schedule-text-color);
		/* position: fixed; */
		width: 100%;
		box-sizing: border-box;
		bottom: 0;
		left: 0;
		padding: 0.75em;
		font-family: 'Open Sans', 'Helvetica', serif;
		font-size: 100%;
		background-color: var(--schedule-accent-color);
		border-top: 1px solid var(--schedule-accent2);
	}

	.footer-button {
		font-family: 'Open Sans', 'Helvetica', serif;
		font-weight: bold;
		font-size: 100%;
		cursor: pointer;
		background-color: transparent;
		outline: none;
		border: none;
		color: var(--schedule-text-color);
	}

	.footer-text {
		padding-right: 1.2em;
		float: right;
		font-size: 115%;
	}

	.refresh {
		color: #eee;
		position: fixed;
		width: 100%;
		bottom: auto;
		z-index: 1;
		padding: 0.25em 0.25em 0.25em 0.75em;
		background-color: rgb(44, 124, 176);
		border-top: 1px solid rgb(56 149 210);
	}

	.update,
	.update:link,
	.update:visited,
	.update:hover,
	.update:active {
		color: #eee;
		text-decoration: underline;
		font-weight: bold;
	}

	.footer-selector {
		padding: 3px;
	}

	.selected {
		color: var(--schedule-red);
	}
/* 
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

	@media only screen and (max-width: 1000px) {
		.schedule-container {
			width: 99%;
		}
	} */

	@media only screen and (max-height: 420px) {
		/* .header,
		.timer {
			font-size: 10vmin;
		} */

		.schedule-container {
			font-size: 5vmin;
		}
	}
</style>
