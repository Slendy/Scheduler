<script lang="ts">
	import { dayjs } from '$lib/shared/dayjs';
	import { fade } from 'svelte/transition';
	import { prettifyWeekdayList } from '$lib/shared/schedule';

	export let environmentId: string;
	export let scheduleId: string;
	export let scheduleType: any;
	export let name: string;
	export let enabled: boolean = false;
	export let events: [any];
	export let variations: [any];
	export let updatedAt: string;
	export let createdAt: string;
	export let scheduleDate: string;
	export let scheduleWeekdays: [string];

	export let isActive: boolean = false;

	// These options are binds
	export let deleteScheduleId: string;
	export let deleteScheduleName: string;

	let headerText = name;
	let copyTimeout: any;

	function copyScheduleId() {
		navigator.clipboard.writeText(scheduleId);
		headerText = 'Copied!';
		if (copyTimeout) {
			clearTimeout(copyTimeout);
		}
		copyTimeout = setTimeout(() => {
			headerText = name;
		}, 2000);
	}

	function deleteSchedule() {
		deleteScheduleId = scheduleId;
		deleteScheduleName = name;
	}
</script>

<div class="col d-flex justify-content-center align-items-start">
	<div class="card" class:border-danger={isActive} style="width: 19rem;">
		<div>
			<div class="card-header text-center">
				<div class="row">
					<div class="col"></div>
					<div class="col-7" title={scheduleId}>
						{#key headerText}
							<button class="btn p-0 m-0" on:click={copyScheduleId} in:fade>
								{headerText}
							</button>
						{/key}
					</div>

					<div class="col">
						<button
							class="btn p-0 px-1 mx-1"
							data-bs-toggle="modal"
							data-bs-target="#scheduleDeleteConfirmation"
							on:click={deleteSchedule}
						>
							<i class="bi bi-trash text-danger"></i>
						</button>
					</div>
				</div>
			</div>
			<ul class="list-group list-group-flush mb-0 border-bottom">
				<li class="list-group-item">
					{#if scheduleType === 'one-time'}
						<span class="card-text">{scheduleDate || 'Invalid schedule date'}</span>
					{:else}
						<span class="card-text w" style="max-width: 5rem;">
							Repeats {prettifyWeekdayList(scheduleWeekdays)}
						</span>
					{/if}
				</li>
				<li class="list-group-item">
					<span class="card-text">{events.length} event{events.length == 1 ? '' : 's'},</span>
					<span class="card-text">
						{variations.length} variation{variations.length == 1 ? '' : 's'}
					</span>
				</li>
				<li class="list-group-item">
					<span class="card-text">{enabled ? 'Enabled' : 'Disabled'}</span>
				</li>
				{#if isActive}
					<li class="list-group-item">
						<span class="card-text text-danger">This schedule is currently active</span>
					</li>
				{/if}
			</ul>
			<div class="card-body">
				<div class="d-flex justify-content-between">
					<a
						href="/admin/environments/{environmentId}/schedule/{scheduleId}"
						class="btn btn-secondary me-2">View Schedule</a
					>
					<a
						href="/admin/environments/{environmentId}/schedule/{scheduleId}/edit?referrer=schedule-list"
						class="btn btn-secondary ms-2">Edit Schedule</a
					>
				</div>
			</div>
			{#if createdAt != null && updatedAt != null}
				<div class="card-footer">
					<small class="d-block text-body-secondary">
						Last updated {dayjs(updatedAt).fromNow()}
					</small>
					<small class="d-block text-body-secondary">
						Created {dayjs(createdAt).fromNow()}
					</small>
				</div>
			{/if}
		</div>
	</div>
</div>
