<script lang="ts">
	import { MAX_EVENT_NAME_LEN } from '$lib/shared/schedule';
	import type { ScheduleEvent, Schedule } from '$lib/shared/types';
	import { MultiSelect } from 'svelte-multiselect';

	import { scale } from 'svelte/transition';
		
	export let event: ScheduleEvent;
	export let schedule: Schedule;
	export let generateRandomId: () => string;

	$: allVariationOptions = schedule.variations.reduce(
		(cur: any, next: any) => [...cur, ...next.options],
		[]
	);
	
</script>

<div
	id="event-{event.eventId}"
	transition:scale
	class="row row-cols-1 row-cols-md-auto justify-content-center justify-content-xxl-start align-items-center event"
>
	<div class="col m-1">
		<div class="d-inline-flex px-1 me-1 mt-1 handle justify-content-end" style="width: 3.5em">
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

	{#if schedule.variations.length > 0 && schedule.variations.some((v) => v.name.length > 0 && v.options.length > 0)}
		<div class="col my-1">
			<div class="option-container">
				<MultiSelect
					bind:selected={event.variations}
					options={allVariationOptions}
					liOptionStyle={'background-color: var(--schedule-schedulebg);'}
					liUserMsgClass={'d-none'}
					--sms-bg="var(--schedule-schedulebg);"
					--sms-li-disabled-bg="var(--schedule-red);"
					--sms-max-width="30em"
					--sms-options-border-width="0"
				/>
				<!-- <MultiSelector bind:selected={event.variations} options={variation.options} label={variation.name} /> -->
			</div>
		</div>
	{/if}
	<div class="col my-1 mt-2 ms-xxl-auto">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="d-inline mt-1">
			<i
				class="bi bi-copy clickable text-secondary me-3"
				aria-label="Duplicate event"
				on:click={() => {
					let currentIndex = schedule.events.indexOf(event);
					console.log(currentIndex);
					let duplicateEvent = { ...event, eventId: generateRandomId() };
					schedule.events = [
						...schedule.events.slice(0, currentIndex + 1),
						duplicateEvent,
						...schedule.events.slice(currentIndex + 1)
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
