<script lang="ts">
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';
	import ScheduleView from '$lib/components/schedule/ScheduleView.svelte';
	import { dayjs } from '$lib/shared/dayjs.js';
	import { hashObject } from '$lib/shared/hash.js';
	import { getLastEvent } from '$lib/shared/schedule.js';
	import { onMount } from 'svelte';

	export let data;

	function slugify(input: string) {
		return input
			.replaceAll(/[^a-zA-Z0-9 ]+/g, '')
			.split(' ')[0]
			.toLowerCase();
	}

	let nextSchedule: any;
	let nextScheduleHash: string;

	async function preloadNextSchedule() {
		if (!data.schedule) return;
		let lastEvent = getLastEvent(data.schedule, dayjs(data.schedule.scheduleDate));
		if (!lastEvent) return;
		let timeUntilEnd = lastEvent.unix() - dayjs().unix();
		console.log(timeUntilEnd);
		console.log((lastEvent.unix() + 1) * 1000);

		// if there are 5 minutes left in the schedule then try and prefetch the next schedule
		if (timeUntilEnd < 5) {
			let startOfNext = (lastEvent.unix() + 1) * 1000;
			let response = await fetch(
				`/api/v1/environments/domain/${$page.params.environmentDomain}/schedule/time/${startOfNext}`,
				{
					headers: {
						'If-None-Match': nextScheduleHash
					}
				}
			);
			if(!response.ok) return;

			nextSchedule = await response.json();
			nextScheduleHash = await hashObject(nextSchedule);
		}
	}

	function onEventChange(oldEvent: any, newEvent: any){
		if(oldEvent && !newEvent && nextSchedule){
			data.schedule = nextSchedule;
			data.scheduleHash = nextScheduleHash;
			nextSchedule = undefined;
			nextScheduleHash = "";
		}
	}

	async function requestNewSchedule() {
		let response = await fetch(
			`/api/v1/environments/domain/${$page.params.environmentDomain}/schedule/current`,
			{
				headers: {
					'If-None-Match': data.scheduleHash
				}
			}
		);
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
			await requestNewSchedule();
		}, 60 * 1000);

		for (let variation of data.schedule.variations) {
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

<body class="transition"></body>

<DarkModeToggle />

<div class="schedule-container transition">
	<ScheduleView schedule={data.schedule} bind:selectedVariations {onEventChange} />
	<footer class="schedule-footer refresh" style="display:none" id="refresh">
		<span> A newer version is available. Please</span>
		<a id="update" class="update"> refresh this page</a>
		<span> to activate it.</span>
	</footer>
	<div class="schedule-footer transition" id="transition-footer">
		<span
			>Made by <a
				href="https://github.com/Slendy"
				style="text-decoration: underline; font-weight: normal">josh</a
			> |
		</span>
		<div id="footer-selectors" style="display: inline">
			{#each data.schedule.variations as variation}
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
			on:click={() => (displayTable = !displayTable)}>View schedule</button
		>
		<span class="footer-text" id="footer-right"></span>
	</div>
</div>
{#if displayTable}
	<div class="table-container">
		<ScheduleEventTable schedule={data.schedule} bind:selectedVariations />
	</div>
{/if}
