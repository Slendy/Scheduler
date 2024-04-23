<script lang="ts">
	import '$lib/components/EditableSpan.svelte';
	import EditableSpan from '$lib/components/EditableSpan.svelte';
	import { slide } from 'svelte/transition';

	let scheduleName = '';
	$: console.log(scheduleName);
	type ScheduleEvent = {
		name: string;
		startTime: string;
		endTime: string;
		options: string[];
	};
	type ScheduleVariation = {
		name: string;
		options: string[];
	};
	let scheduleEvents: ScheduleEvent[] = [];
	let scheduleVariations: ScheduleVariation[] = [];
	function addNewEvent() {
		scheduleEvents = [
			...scheduleEvents,
			{
				name: '',
				startTime: '',
				endTime: '',
				options: []
			}
		];
	}

	export let data;
</script>

<div
	class="modal fade"
	id="deleteConfirmationModal"
	tabindex="-1"
	aria-labelledby="deleteModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="deleteModalLabel">
					Are you sure you want to delete this event?
				</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
				<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="removeItem()"
					>Delete</button
				>
			</div>
		</div>
	</div>
</div>

<div class="container">
	<div class="text-center card p-3">
		<div class="schedule-title fs-3 d-block">
			<EditableSpan placeholder={'Schedule name'} maxLength={32} bind:value={scheduleName}
			></EditableSpan>
		</div>

		<hr />

		<div class="row row-cols-md-3 row-cols-1">
			<div class="col"></div>
			<div class="col">
				<h5 class="fw-bold mb-3 d-inline">Events</h5>
			</div>
			<div class="col d-flex justify-content-center justify-content-md-end">
				<button
					class="btn btn-secondary me-md-5 mt-2 mt-md-0"
					id="add-event"
					style="margin-top: -0.25em"
					on:click={() => addNewEvent()}>Add event</button
				>
			</div>
		</div>

		<div id="event-container" class="event-container">
			{#each scheduleEvents as event}
				<div class="d-block mt-3 event-block" transition:slide>
					<div class="row row-cols-auto justify-content-center">
						<div class="col m-1">
							<div class="d-inline px-1 me-1 mt-1 handle">☰</div>

							<input
								class="schedule-input"
								placeholder="Event name"
								name="event-name"
								maxlength="32"
								bind:value={event.name}
							/>
						</div>
						<div class="col my-1">
							<label class="fw-bold ps-2 pe-1" for="start-time">START: </label>
							<input
								class="schedule-input"
								type="time"
								name="start-time"
								id="start-time"
								bind:value={event.startTime}
							/>
						</div>
						<div class="col my-1">
							<label class="fw-bold ps-2 pe-1" for="end-time">END: </label>
							<input
								class="schedule-input"
								type="time"
								name="end-time"
								id="end-time"
								bind:value={event.endTime}
							/>
						</div>
						<div class="col my-1">
							<div class="option-container d-inline-block">
								{#each scheduleVariations as variation}
									<label class="fw-bold ps-2 pe-1 d-inline" for="variation-{variation.name}"
										>Option Name:
									</label>
									<!-- @* TOOD: what if this was one menu with different sections for each variation
                             and then each event can check each variation they want to appear in,
                             which gets rid of the need for an 'all' option *@ -->
									<select class="schedule-input" id="variation-{variation.name}">
										<option class="schedule-input">Option 1</option>
										<option class="schedule-input">Option 2</option>
										<option class="schedule-input">Option 3</option>
									</select>
								{/each}
							</div>

							<div class="d-inline">
								<i
									class="bi bi-trash clickable ms-2 text-danger"
									data-bs-toggle="modal"
									data-bs-target="#deleteConfirmationModal"
									onclick="selectItem('event', this.closest('.event-container'), this.closest('.event-block'))"
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
			<div class="col">
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
					style="margin-top: -0.25em;">Add variation</button
				>
			</div>
		</div>

		<div class="container text-center">
			<div
				class="d-flex justify-content-center row row-cols-auto variation-container"
				id="variation-container"
			>
				<div class="col d-none variation-block" id="variation-template">
					<div class="card mt-3 text-center mx-auto" style="width: 14rem">
						<div class="card-header py-0">
							<span
								class="schedule-title p-1 px-2 d-flex text-center mx-auto"
								data-schedule-input
								contenteditable="true"
								maxlength="16"
								name="variation-title"
								placeholder="Variation name"
								data-gramm="false"
							>
							</span>
							<i
								class="bi bi-trash position-absolute text-danger end-0 top-0 pe-3 pt-1 clickable"
								data-bs-toggle="modal"
								data-bs-target="#deleteConfirmationModal"
								onclick="selectItem('variation', this.closest('#variation-container'), this.closest('.variation-block'))"
							>
							</i>
						</div>
						<div class="card-body p-1 variation-item-container">
							<div class="row variation-item-block">
								<div class="col"></div>
								<div class="col-auto">
									<span
										class="card-text schedule-title d-flex p-1 px-2 text-center mx-auto mt-1"
										data-schedule-input
										data-schedule-growable-list
										contenteditable="true"
										name="variation-option"
										placeholder="New variation"
										data-gramm="false"
									>
									</span>
								</div>
								<div class="col">
									<i
										class="bi bi-x d-inline position-static text-secondary fs-3 clickable d-none"
										onclick="deleteVariationItem(this)"
									>
									</i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<hr />

		<div class="d-inline">
			<!-- @* TODO: change link to go back to /environments/{envId} *@ -->
			<button class="btn btn-secondary m-1">Save changes</button>

			<a href="/admin/environments/{data.environment._id}" class="btn btn-danger m-1">Discard</a>
		</div>
	</div>
</div>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
</svelte:head>
