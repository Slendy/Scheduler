<script lang="ts">
	import { browser } from '$app/environment';
	import { invalidate, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import ScheduleEventTable from '$lib/components/schedule/ScheduleEventTable.svelte';
	import ScheduleView from '$lib/components/schedule/ScheduleView.svelte';
	import { createCachedSchedule, getLastEvent, getNextEvent } from '$lib/shared/schedule.js';
	import { onMount } from 'svelte';

	export let data;

	function slugify(input: string){
		return input.replaceAll(/[^a-zA-Z0-9 ]+/g, "").split(" ")[0].toLowerCase();
	}

	function invalidateSchedule(){
		invalidate(`/api/v1/environments/domain/${$page.params.environmentDomain}/schedule/current`)
	}

	function checkScheduleValidity(){

	}

	onMount(() => {
		if(!browser){
			return;
		}

		// check for schedule updates every minute
		let interval = setInterval(() => {
			invalidateSchedule();
		}, 60 * 1000)
		for(let variation of data.schedule.variations){
			let queryParam = $page.url.searchParams.get(slugify(variation.name)) || "";
			let urlOption = variation.options.find((o: any) => slugify(o) === slugify(queryParam)) || variation.options[0];
		
			selectedVariations = [...selectedVariations, urlOption];
		}
		return () => {
			clearInterval(interval);
		}
	});

	let selectedVariations: string[] = [];
	let nextEvent: any;
	$: {
		if(new Date().getTime() > getLastEvent(data.schedule, new Date()).getTime()){
			console.log("schedule is over we're finished")
			invalidateSchedule();
		}
	}
	let displayTable: boolean = false;
</script>

<body class="transition"></body>

<DarkModeToggle />

<div class="schedule-container transition">
	<ScheduleView schedule={data.schedule} {selectedVariations} bind:nextEvent />
	<footer class="schedule-footer refresh" style="display:none" id="refresh">
		<span> A newer version is available. Please</span>
		<a id="update" class="update"> refresh this page</a>
		<span> to activate it.</span>
	</footer>
	<div class="schedule-footer transition" id="transition-footer">
		<span>Made by <a href="https://github.com/Slendy" style="text-decoration: underline; font-weight: normal">josh</a> | </span>
		<div id="footer-selectors" style="display: inline">
			{#each data.schedule.variations as variation}
				{#each variation.options as option}
					<button
						class="footer-button footer-selector transition"
						class:selected={selectedVariations.includes(option)}
						on:click={() => {
							// remove other selected options from this variation
							selectedVariations = selectedVariations.filter((v) => !variation.options.includes(v));

							console.log(slugify(option));
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
		<ScheduleEventTable schedule={data.schedule} {selectedVariations} />
	</div>
{/if}
