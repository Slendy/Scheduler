<script lang="ts">
	import { createCachedSchedule } from '$lib/shared/schedule';
	import type { Schedule } from '$lib/shared/types';
	import { scale } from 'svelte/transition';

	export let schedule: Schedule;
	export let scheduleDate: Date = new Date();
	export let selectedVariations: string[];
	export let transition: boolean = true;
	$: cachedSchedule = createCachedSchedule(schedule, scheduleDate);

	//NOTE(josh): if this component starts acting wacky it's probably because of the global transition
</script>

{#if cachedSchedule != null}
	<div class="schedule-container">
		<div class="schedule-view transition" transition:scale|global={{duration: transition ? 400 : 0}}>
			<span class="schedule-title">
				Schedule for {cachedSchedule?.events[0].startTimeDate.toLocaleString('en-US', {
					month: 'long',
					day: 'numeric'
				})}
			</span>
			<table class="schedule-table">
				<tbody>
					{#each cachedSchedule.events.filter((e) => schedule.variations.length == 0 || selectedVariations.some(v => e.variations.includes(v))) as event}
						<tr>
							<td class="table-left">{event.name}</td>
							<td class="table-right">
								{event.startTimeDate.toLocaleString('en-US', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: true
								}) +
									' - ' +
									event.endTimeDate.toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true
									})}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	.schedule-container {
		display: flex;
		flex-grow: 1;
		transition: all 0.5s;
		align-items: center;
		justify-content: center;
	}

	.schedule-view {
		color: var(--schedule-text-color);
		font-family: 'Open Sans', 'Helvetica', serif;
		font-size: 2.5vmax;
		text-align: center;
		width: 100%;
		white-space: nowrap;
		box-shadow: 0 0 3px rgba(255, 255, 255, 0);
		background-color: var(--schedule-schedulebg);
		border-radius: 10px;
		border-width: 2px;
		border-style: solid;
		border-color: var(--schedule-scheduleborder);
		padding: 0.5em 0;
	}
	.schedule-table {
		width: 90%;
		margin-left: auto;
		margin-right: auto;
	}
	.table-left {
		padding-right: 5px;
		word-wrap: normal;
		word-break: break-word;
		white-space: pre-wrap;
	}

	.table-right {
		padding-left: 5px;
		margin-right: 15px;
	}

	.schedule-title {
		display: block;
		font-weight: bold;
	}
</style>
