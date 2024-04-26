<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ScheduleEditor from '$lib/components/schedule/ScheduleEditor.svelte';

	export let data;
</script>

<Header>Edit {data.schedule.name}</Header>

<ScheduleEditor
	environmentId={data.environment._id}
	schedule={data.schedule}
	actionUrl={`/api/v1/admin/environments/id/${data.environment._id}/schedule/${data.schedule.scheduleId}/update`}
	redirect={`/admin/environments/${data.environment._id}/schedule/${data.schedule.scheduleId}`}
/>
