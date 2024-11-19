<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let environmentId: string;
	export let scheduleId: string;
	export let enabled: boolean;
	export let active: boolean;

	export let submitting: boolean = false;

	async function toggleSchedule() {
		if (submitting) {
			return;
		}
		submitting = true;

		await fetch(`/api/v1/admin/environments/id/${environmentId}/schedule/id/${scheduleId}/toggle`, {
			method: 'POST'
		});

		await invalidateAll();

		submitting = false;
	}
</script>

{#if enabled}
	{#if active}
		<p class="text-danger">This schedule is currently active</p>
	{/if}
	<button class="btn btn-danger" class:disabled={submitting} on:click={toggleSchedule}>
		Disable schedule
	</button>
{:else}
	<button class="btn btn-success" class:disabled={submitting} on:click={toggleSchedule}>
		Enable schedule
	</button>
{/if}
