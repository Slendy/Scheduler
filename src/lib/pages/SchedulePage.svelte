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
	import type { Dayjs } from 'dayjs';

	function slugify(input: string) {
		return input
			.replaceAll(/[^a-zA-Z0-9 ]+/g, '')
			.split(' ')[0]
			.toLowerCase();
	}

	let nextSchedule: any;
	let nextScheduleHash: string;

	export let data: any;

	export let environmentDomain: string;

	async function preloadNextSchedule() {
		// if there are 5 minutes left in the schedule then try and fetch the next schedule
		requestNextSchedule((lastEvent: Dayjs) => {
			return lastEvent.unix() - dayjs().unix() < 3 * 60;
		}).then((r) => {
			nextSchedule = r?.nextSchedule;
			nextScheduleHash = r?.nextScheduleHash || '';
		});
	}

	function onEventChange(oldEvent: any, newEvent: any) {
		if (oldEvent != null && newEvent == null) {
			if (nextSchedule) {
				data.schedule = nextSchedule;
				data.scheduleHash = nextScheduleHash;
				nextSchedule = undefined;
				nextScheduleHash = '';
			} else {
				// if we didn't preload the schedule somehow then load it
				requestNextSchedule(data.schedule).then((r) => {
					data.schedule = r?.nextSchedule;
					data.scheduleHash = r?.nextScheduleHash;
					nextSchedule = undefined;
					nextScheduleHash = '';
				});
			}
		}
	}

	async function requestNextSchedule(predicate: (time: Dayjs) => boolean = () => true) {
		if (!data.schedule) {
			return undefined;
		}

		let lastEvent = getLastEvent(data.schedule, dayjs(data.schedule.scheduleDate));
		if (!lastEvent) {
			return undefined;
		}

		if (!predicate(lastEvent)) {
			return undefined;
		}
		let startOfNext = (lastEvent.unix() + 1) * 1000;
		let response = await fetch(
			`/api/v1/environments/domain/${environmentDomain}/schedule/time/${startOfNext}`,
			{
				headers: {
					'If-None-Match': nextScheduleHash
				}
			}
		);
		if (!response.ok) {
			return undefined;
		}

		let nextSchedule = await response.json();

		return { nextSchedule, nextScheduleHash: await hashObject(nextSchedule) };
	}

	async function fetchCurrentSchedule() {
		let response = await fetch(
			`/api/v1/environments/domain/${environmentDomain}/schedule/current`,
			{
				headers: {
					'If-None-Match': data.scheduleHash
				}
			}
		);
		// there is no more schedule
		if (response.status == 404) {
			data.schedule = undefined;
			data.scheduleHash = undefined;
		}

		if (!response.ok) return;

		data.schedule = await response.json();
		data.scheduleHash = await hashObject(data.schedule);
	}

	onMount(() => {
		if (!browser) {
			return;
		}

		// check for schedule updates every minute
		let interval = setInterval(async () => {
			await preloadNextSchedule();
			await fetchCurrentSchedule();
		}, 60 * 1000);

		// set initial variation based on query params
		for (let variation of data.schedule?.variations || []) {
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
	<link href="/css/schedule.css" rel="stylesheet" />
</svelte:head>

<body class="transition schedule-body"></body>

<DarkModeToggle />

<div class="schedule-container transition">
	<ScheduleCountdown bind:schedule={data.schedule} bind:selectedVariations {onEventChange} />
	<footer class="schedule-footer refresh" style="display:none" id="refresh">
		<span> A newer version is available. Please</span>
		<a id="update" class="link update"> refresh this page</a>
		<span> to activate it.</span>
	</footer>
	<div class="schedule-footer transition" id="transition-footer">
		<span>
			Made by
			<a
				href="https://github.com/Slendy"
				style="text-decoration: underline; font-weight: normal"
				class="schedule-link"
			>
				josh
			</a>
		</span>
		{#each data.schedule?.variations || [] as variation}
			{#each variation.options as option}
				<span>{' | '}</span>
				<button
					class="footer-button footer-selector transition"
					class:selected={selectedVariations.includes(option)}
					on:click={() => {
						// remove other selected options from this variation
						selectedVariations = selectedVariations.filter((v) => !variation.options.includes(v));

						$page.url.searchParams.set(slugify(variation.name), slugify(option));

						replaceState($page.url, $page.state);

						selectedVariations.push(option);
					}}
				>
					{option}
				</button>
			{/each}
		{/each}
		{#if data.schedule != null}
			<span>{' | '}</span>
			<button
				class="footer-button transition"
				id="toggle-schedule"
				on:click={() => (displayTable = !displayTable)}
			>
				View schedule
			</button>
		{/if}
		<span class="footer-text" id="footer-right"></span>
	</div>
</div>
{#if displayTable && data.schedule != null}
	<div class="table-container">
		<ScheduleEventTable bind:schedule={data.schedule} bind:selectedVariations />
	</div>
{/if}
