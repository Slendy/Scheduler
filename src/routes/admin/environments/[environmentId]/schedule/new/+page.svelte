<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ImportScheduleModal from '$lib/components/modal/ImportScheduleModal.svelte';
	import ScheduleEditor from '$lib/components/schedule/ScheduleEditor.svelte';
	import { defaultSchedule } from '$lib/shared/schedule.js';
	import type { Schedule } from '$lib/shared/types.js';

	export let data;

	let schedule: Schedule = defaultSchedule;
	//TODO redirect to newly created schedule instead
</script>

<Header>Create schedule</Header>

{#if data.environment.schedules.length > 0}
	<ImportScheduleModal bind:schedule environment={data.environment} />

	<div class="text-center mb-3">
		<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#importSchedule">
			Import from existing schedule
		</button>
	</div>
{/if}

<ScheduleEditor
	bind:schedule
	environmentId={data.environment._id}
	actionUrl={`/api/v1/admin/environments/id/${data.environment._id}/schedule/new`}
	redirect={`/admin/environments/${data.environment._id}`}
/>
