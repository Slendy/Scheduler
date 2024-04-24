<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ScheduleEditor from '$lib/components/schedule/ScheduleEditor.svelte';

	export let data;
</script>

<Header>Create schedule</Header>

<ScheduleEditor
	environmentId={data.environment._id}
	actionUrl={`/api/v1/admin/environments/id/${data.environment._id}/schedule/new`}
/>
