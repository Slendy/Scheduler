<script lang="ts">
	import { browser } from '$app/environment';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import EditableSpan from '$lib/components/schedule/EditableSpan.svelte';
	import VariationCard from '$lib/components/schedule/VariationCard.svelte';
	import { verifySchedule as collectScheduleErrors } from '$lib/shared/schedule';
	import type { Schedule } from '$lib/shared/types.js';
	import { MultiSelect } from 'svelte-multiselect';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';

	export let schedule: Schedule = {
		scheduleId: '',
		events: [],
		name: '',
		variations: []
	};

	export let redirect: string;

	function addNewEvent() {
		schedule.events = [
			...schedule.events,
			{
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
		}
	});

	// I wanna krill myself
	$: serializedSchedule = JSON.stringify(schedule);

	let errorMessages: string[] | undefined = undefined;
	let errorTimer: NodeJS.Timeout | undefined;

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

	export let environmentId: string;

	export let actionUrl: string;
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
			{#each schedule.events as event}
				<div class="d-block event-block" transition:slide>
					<div class="row row-cols-auto justify-content-center align-items-center">
						<div class="col m-1">
							<div class="d-inline px-1 me-1 mt-1 handle">☰</div>

							<input
								class="schedule-input"
								placeholder="Event name"
								maxlength="32"
								bind:value={event.name}
							/>
						</div>
						<div class="col my-1">
							<label class="fw-bold ps-2 pe-1" for="start-time">START: </label>
							<input
								class="schedule-input"
								type="time"
								id="start-time"
								bind:value={event.startTime}
							/>
						</div>
						<div class="col my-1">
							<label class="fw-bold ps-2 pe-1" for="end-time">END: </label>
							<input class="schedule-input" type="time" id="end-time" bind:value={event.endTime} />
						</div>
						<!-- If all the variations have a name and have atleast 1 option -->
						{#if schedule.variations.length > 0 && schedule.variations.reduce((sum, cur) => sum && cur.name.length > 0 && cur.options.length > 0, true)}
							<div class="col my-1">
								<div class="option-container d-inline">
									{#each schedule.variations as variation}
										<label class="fw-bold ps-2 pe-1 d-inline" for="variation-{variation.name}"
											>{variation.name}
										</label>

										<MultiSelect bind:selected={event.variations} options={variation.options} />
									{/each}
								</div>
							</div>
						{/if}
						<div class="col my-1 mt-2">
							<div class="d-inline mt-1">
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<i
									class="bi bi-trash clickable text-danger"
									on:click={() => {
										schedule.events = schedule.events.filter((t) => t != event);
									}}
								>
								</i>
							</div>
						</div>
					</div>
				</div>
			{/each}
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

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
</svelte:head>
