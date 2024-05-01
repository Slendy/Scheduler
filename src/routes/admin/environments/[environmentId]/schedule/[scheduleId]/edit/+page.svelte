<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ScheduleEditor from '$lib/components/schedule/ScheduleEditor.svelte';
	import { page } from '$app/stores';

	export let data;

	let referrer = $page.url.searchParams.get('referrer');
	let redirect = `/admin/environments/${data.environment._id}/schedule/${data.schedule.scheduleId}`;
	if(referrer === 'schedule-list'){
		redirect = `/admin/environments/${data.environment._id}`
	}

</script>

<Header>Edit {data.schedule.name}</Header>

<ScheduleEditor
	environmentId={data.environment._id}
	schedule={data.schedule}
	actionUrl={`/api/v1/admin/environments/id/${data.environment._id}/schedule/id/${data.schedule.scheduleId}/update`}
	redirectUrl={redirect}
	discardUrl={redirect}
/>
