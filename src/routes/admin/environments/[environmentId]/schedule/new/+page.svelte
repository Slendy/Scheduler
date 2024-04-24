<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import EditableSpan from '$lib/components/schedule/EditableSpan.svelte';
	import VariationCard from '$lib/components/schedule/VariationCard.svelte';
	import { verifySchedule as collectScheduleErrors, convertTimeToSeconds } from '$lib/shared/schedule';
	import type { ScheduleEvent, ScheduleVariation } from '$lib/shared/types.js';
	import { MultiSelect } from 'svelte-multiselect';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';
	import ScheduleEditor from '$lib/components/schedule/ScheduleEditor.svelte';

	let scheduleName = '';

	let scheduleEvents: ScheduleEvent[] = [];
	let scheduleVariations: ScheduleVariation[] = [];
	function addNewEvent() {
		scheduleEvents = [
			...scheduleEvents,
			{
				name: '',
				startTime: '',
				endTime: '',
				variations: []
			}
		];
	}

	function addNewVariation() {
		scheduleVariations = [
			...scheduleVariations,
			{
				name: '',
				options: []
			}
		];
		console.log('add variation: ', scheduleVariations);
	}

	onMount(() => {
		if (browser) {
			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

			const tooltipList = [...tooltipTriggerList].map(
				// @ts-ignore
				(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
			);
		}
	});

	// I wanna krill myself
	$: serializedSchedule = JSON.stringify({
		name: scheduleName,
		events: scheduleEvents,
		variations: scheduleVariations
	});

	let errorMessages: string[] | undefined = undefined;
	let errorTimer: NodeJS.Timeout | undefined;

	// some simple client-side checks before submitting form to server


	export let data;
</script>

<Header>Create schedule</Header>

<ErrorAlert messages={errorMessages} />

<ScheduleEditor environmentId={data.environment._id} actionUrl={`/api/v1/admin/environments/id/${data.environment._id}/schedules/new`}/>

