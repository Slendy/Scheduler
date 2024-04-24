<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ScheduleView from '$lib/components/schedule/ScheduleView.svelte';

	export let data;

	let displaySchedule: boolean = false;
	let selectedVariation: string = '';
</script>

<svelte:head>
	<link rel="stylesheet" href="/css/schedule.css" />
</svelte:head>

<Header>{data.schedule.name}</Header>

<p>Schedule view page: {JSON.stringify(data.schedule, null, 2)}</p>

<button class="btn btn-secondary" on:click={() => (displaySchedule = !displaySchedule)}>
	Toggle preview
</button>

{#if displaySchedule}
	<div>
		<ScheduleView schedule={data.schedule} {selectedVariation}></ScheduleView>
	</div>
{/if}
