<script lang="ts">
	import { browser } from '$app/environment';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import EditableSpan from '$lib/components/schedule/EditableSpan.svelte';
	import VariationCard from '$lib/components/schedule/VariationCard.svelte';
	import { verifySchedule as collectScheduleErrors, defaultSchedule } from '$lib/shared/schedule';
	import { scheduleWeekdays, type Schedule } from '$lib/shared/types.js';
	import { SortableList } from '@sonderbase/svelte-sortablejs';
	import { onMount } from 'svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';
	import RadioSelector from '../RadioSelector.svelte';
	import EventRow from './EventRow.svelte';

	export let schedule: Schedule = defaultSchedule;

	export let redirect: string;

	export let environmentId: string;

	export let actionUrl: string;

	// I wanna krill myself
	$: serializedSchedule = JSON.stringify(schedule);

	let errorMessages: string[] | undefined = undefined;
	let errorTimer: NodeJS.Timeout | undefined;

	function addNewEvent() {
		schedule.events = [
			...schedule.events,
			{
				eventId: generateRandomId(),
				name: '',
				startTime: '',
				endTime: '',
				variations: []
			}
		];
	}

	function addNewVariation() {
		schedule.variations = [
			...schedule.variations,
			{
				name: '',
				options: []
			}
		];
	}

	onMount(() => {
		if (browser) {
			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

			const tooltipList = [...tooltipTriggerList].map(
				// @ts-ignore
				(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
			);

			if (crypto.randomUUID) {
				generateRandomId = () => crypto.randomUUID();
			}
		}
	});

	// some browsers don't let you use randomUUID() in a local environment so by default we use a less secure version
	// and when mounting the component we replace this function if randomUUID exists.
	let generateRandomId: () => string = function () {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
		);
	};

	// some simple client-side checks before submitting form to server
	function verifySchedule(e: Event) {
		let errors = collectScheduleErrors(schedule);
		if (errors.length == 0) {
			return;
		}
		if (errorTimer) {
			clearTimeout(errorTimer);
		}
		errorMessages = errors;
		errorTimer = setTimeout(() => {
			errorMessages = undefined;
		}, 5000);
		e.preventDefault();
		e.stopImmediatePropagation();
	}

	function getStore(sortable: any): string[] {
		return [];
	}

	// this is used to recreate the sortable list whenever we let go of an item to force
	// the items to actually refresh. TLDR; I wanna krill myself part 2: electric boogaloo
	let eventRecreate = generateRandomId();
	function setStore(sortable: any) {
		let newOrder: string[] = sortable.toArray();
		schedule.events = schedule.events
			.slice()
			.sort((a, b) => newOrder.indexOf(a.eventId) - newOrder.indexOf(b.eventId));
		eventRecreate = generateRandomId();
	}
</script>

<ErrorAlert messages={errorMessages} />

<EnhancedForm
	action={actionUrl}
	onKeydown={(e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	}}
	succeed={(_) => {
		goto(redirect, { invalidateAll: true });
	}}
	fail={(result) => (errorMessages = result.errors)}
	onSubmit={(e) => verifySchedule(e)}
>
	<input name="data" type="hidden" value={serializedSchedule} />
	<div class="text-center card p-3">
		<div class="schedule-title fs-3 d-block">
			<EditableSpan placeholder={'Schedule name'} maxLength={32} bind:value={schedule.name} />
		</div>

		<hr />

		<div class="row row-cols-md-3 row-cols-1">
			<div class="col"></div>
			<div class="col mt-2">
				<h5 class="fw-bold mb-3 d-inline">Events</h5>
			</div>
			<div class="col d-flex justify-content-center justify-content-md-end">
				<button
					type="button"
					class="btn btn-secondary me-md-5 mt-2 mt-md-0"
					id="add-event"
					style="margin-top: -0.25em"
					on:click={() => addNewEvent()}>Add event</button
				>
			</div>
		</div>

		<div id="event-container" class="event-container">
			{#key eventRecreate}
				<SortableList class="" handle=".handle" store={{ get: getStore, set: setStore }}>
					{#each schedule.events as event}
						<EventRow bind:event bind:schedule {generateRandomId} />
					{/each}
				</SortableList>
			{/key}
		</div>

		<hr />

		<div class="row row-cols-md-3 row-cols-1">
			<div class="col"></div>
			<div class="col mt-1">
				<h5 class="fw-bold mb-3 d-inline">Schedule variations</h5>
				<span
					data-bs-toggle="tooltip"
					data-bs-placement="right"
					title="Schedule variations are a way to create different versions of a schedule for users to select."
				>
					<i class="bi bi-question-circle ms-2" style="font-size: 1em;"></i>
				</span>
			</div>
			<div class="col d-flex justify-content-center justify-content-md-end">
				<button
					class="btn btn-secondary me-md-5 mt-2 mt-md-0"
					id="add-variation"
					style="margin-top: -0.25em;"
					type="button"
					on:click={() => addNewVariation()}>Add variation</button
				>
			</div>
		</div>

		<div class="container text-center">
			<div
				class="d-flex justify-content-center row row-cols-auto variation-container"
				id="variation-container"
			>
				{#each schedule.variations as variation}
					<VariationCard
						bind:title={variation.name}
						bind:options={variation.options}
						deleteCallback={() =>
							(schedule.variations = schedule.variations.filter((v) => v != variation))}
					/>
				{/each}
			</div>
		</div>

		<hr />

		<div class="row row-cols-1 mb-2">
			<div class="col">
				<h5 class="fw-bold d-inline">Schedule type</h5>
			</div>
		</div>

		<div class="container text-center">
			<RadioSelector
				name="schedule-type"
				bind:value={schedule.scheduleType}
				options={[
					{ label: 'One-time', id: 'one-time' },
					{ label: 'Repeating', id: 'repeating' }
				]}
			/>
			{#if schedule.scheduleType == 'one-time'}
				<div class="d-block m-3">
					<div class="d-inline">
						<label class="fw-bold ps-2 pe-1" for="schedule-date">Schedule Date: </label>
						<input
							class="schedule-input"
							type="date"
							id="schedule-date"
							bind:value={schedule.scheduleDate}
						/>
					</div>
				</div>
			{:else}
				<div class="d-block m-3">
				{#each scheduleWeekdays as weekday}
					<input type="checkbox" class="btn-check" id="btn-{weekday}" autocomplete="off" value={weekday} bind:group={schedule.scheduleWeekdays}/>
					<label class="btn btn-outline-secondary text-capitalize" for="btn-{weekday}">{weekday}</label>
				{/each}
				</div>
			{/if}
		</div>

		<hr />

		<div class="d-inline">
			<button class="btn btn-secondary m-1" type="submit">
				{schedule.scheduleId.length == 0 ? 'Create schedule' : 'Save schedule'}
			</button>

			{#if schedule.scheduleId.length == 0}
				<a href="/admin/environments/{environmentId}" class="btn btn-danger m-1"> Discard </a>
			{:else}
				<a
					href="/admin/environments/{environmentId}/schedule/{schedule.scheduleId}"
					class="btn btn-danger m-1"
				>
					Discard changes
				</a>
			{/if}
		</div>
	</div>
</EnhancedForm>
