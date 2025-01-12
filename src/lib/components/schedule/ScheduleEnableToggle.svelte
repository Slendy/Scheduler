<script lang="ts">
	import { invalidateAll } from '$app/navigation';


	interface Props {
		environmentId: string;
		scheduleId: string;
		enabled: boolean;
		active: boolean;
		submitting?: boolean;
	}

	let {
		environmentId,
		scheduleId,
		enabled,
		active,
		submitting = $bindable(false)
	}: Props = $props();

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
	<button class="btn btn-danger" class:disabled={submitting} onclick={toggleSchedule}>
		Disable schedule
	</button>
{:else}
	<button class="btn btn-success" class:disabled={submitting} onclick={toggleSchedule}>
		Enable schedule
	</button>
{/if}
