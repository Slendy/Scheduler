<script lang="ts">
	import { MAX_EVENT_NAME_LEN } from '$lib/shared/schedule';
	import type { ScheduleEvent, Schedule } from '$lib/shared/types';
	import { MultiSelect } from 'svelte-multiselect';

	import { slide } from 'svelte/transition';

	export let event: ScheduleEvent;
	export let schedule: Schedule;
	export let generateRandomId: () => string;
</script>

<div
	class="d-block event-block"
	data-id={event.eventId}
	id="event-{event.eventId}"
	transition:slide
>
	<div class="row row-cols-auto justify-content-center align-items-center">
		<div class="col m-1">
			<div class="d-inline px-1 me-1 mt-1 handle">
				{schedule.events.indexOf(event) + 1} ☰
			</div>

			<input
				class="schedule-input"
				placeholder="Event name"
				maxlength={MAX_EVENT_NAME_LEN}
				bind:value={event.name}
			/>
		</div>
		<div class="col my-1">
			<label class="fw-bold ps-2 pe-1" for="{event.eventId}-start-time">START: </label>
			<input
				class="schedule-input"
				type="time"
				id="{event.eventId}-start-time"
				bind:value={event.startTime}
			/>
		</div>
		<div class="col my-1">
			<label class="fw-bold ps-2 pe-1" for="{event.eventId}-end-time">END: </label>
			<input
				class="schedule-input"
				type="time"
				id="{event.eventId}end-time"
				bind:value={event.endTime}
			/>
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
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="d-inline mt-1">
				<i
					class="bi bi-copy clickable text-secondary me-3"
					aria-label="Duplicate event"
					on:click={() => {
						let currentIndex = schedule.events.indexOf(event);
						let duplicateEvent = { ...event, eventId: generateRandomId() };
						schedule.events = [
							...schedule.events.slice(0, currentIndex),
							duplicateEvent,
							...schedule.events.slice(currentIndex)
						];
					}}
				>
				</i>
				<i
					aria-label="Delete event"
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
