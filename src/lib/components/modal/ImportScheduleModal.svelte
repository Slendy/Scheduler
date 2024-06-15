<script lang="ts">
	import Modal from './Modal.svelte';
	import type { Schedule } from '$lib/shared/types';
	import { isScheduleEmpty } from '$lib/shared/schedule';
	import { dayjs } from '$lib/shared/dayjs';

	export let environment: any;
	$: sortedSchedules = environment.schedules.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

	export let schedule: Schedule;

	let selectedSchedule: string;

	function importSchedule() {
		let importedSchedule = environment.schedules.find((s: any) => s.scheduleId == selectedSchedule);
		importedSchedule.scheduleId = '';
		schedule = importedSchedule;
	}
</script>

<Modal modalId={'importSchedule'}>
	<div class="modal-header">
		<h1 class="modal-title fs-5" id="deleteModalLabel">Select an existing schedule to import</h1>
		<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
	</div>
	<div class="modal-body">
		{#if !isScheduleEmpty(schedule)}
			<div class="alert alert-warning" role="alert">
				The current schedule will be overwritten after importing
			</div>
		{/if}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		{#each sortedSchedules as schedule}
			<div
				class="card m-3 transition"
				class:border-primary={selectedSchedule == schedule.scheduleId}
				on:click={() => (selectedSchedule = schedule.scheduleId)}
			>
				<div class="card-header">
					{schedule.name}
				</div>
				<div class="card-body">
					<p class="card-text">
						{schedule.events.length} event{schedule.events.length == 1 ? '' : 's'},
						{schedule.variations.length} variation{schedule.variations.length == 1 ? '' : 's'}
					</p>
					{#if schedule.updatedAt != null}
						<p class="card-text">
							<small class="text-body-secondary">
								Last updated {dayjs(schedule.updatedAt).fromNow()}
							</small>
						</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="modal-footer">
		<button
			type="button"
			class="btn btn-secondary"
			data-bs-dismiss="modal"
			disabled={!selectedSchedule}
			on:click={importSchedule}
		>
			Import schedule
		</button>
		<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
	</div>
</Modal>
