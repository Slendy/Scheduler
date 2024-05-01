<script lang="ts">
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';
	import ScheduleView from '$lib/components/schedule/ScheduleView.svelte';
	import type { Schedule } from '$lib/shared/types';

	let testSchedule: Schedule = {
		scheduleId: '',
		name: 'Test schedule',
		variations: [],
		enabled: true,
		scheduleDate: undefined,
		scheduleType: 'one-time',
		scheduleWeekdays: undefined,
		events: [
			{
				name: 'test event',
				startTime: '0:00',
				endTime: '23:59',
				variations: [],
				eventId: 'bruh'
			}
		]
	};

	let selectedVariations: string[];
	let displayTable: boolean = false;
</script>

<svelte:head>
	<script>
		// we need to put this script in the header and not in onMount, otherwise the page flashes the default on load
		const getPreferredScheme = () =>
			window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';

		let storedTheme = localStorage.getItem('colorTheme') ?? getPreferredScheme();

		if (storedTheme === 'dark') {
			enableDarkMode();
		} else {
			disableDarkMode();
		}

		function enableDarkMode() {
			document.querySelector(':root')?.classList.add('darkMode');
			document.querySelector(':root')?.classList.remove('lightMode');
		}
		function disableDarkMode() {
			document.querySelector(':root')?.classList.add('lightMode');
			document.querySelector(':root')?.classList.remove('darkMode');
		}
	</script>
</svelte:head>
<body class="transition"></body>

<DarkModeToggle />

<div class="schedule-container transition">
	<ScheduleView schedule={testSchedule} {selectedVariations} />
	<footer class="schedule-footer refresh" style="display:none" id="refresh">
		<span> A newer version is available. Please</span>
		<a id="update" class="update"> refresh this page</a>
		<span> to activate it.</span>
	</footer>
	<div class="schedule-footer transition" id="transition-footer">
		<span style="padding-right: 4px">Made by josh</span>
		<span> | </span>
		<div id="footer-selectors" style="display: inline">
			{#each testSchedule.variations as variation}
				{#each variation.options as option}
					<button
						class="footer-button footer-selector transition"
						class:selected={selectedVariations.includes(option)}
						on:click={() => {
							// remove other selected options from this variation
							selectedVariations = selectedVariations.filter((v) => !variation.options.includes(v));

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
		<ScheduleEventTable schedule={testSchedule} {selectedVariations} />
	</div>
{/if}
