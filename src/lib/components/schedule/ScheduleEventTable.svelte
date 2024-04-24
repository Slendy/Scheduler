<script lang="ts">
	import { createCachedSchedule } from '$lib/shared/schedule';
	import type { Schedule } from '$lib/shared/types';
	import { scale } from 'svelte/transition';

	export let schedule: Schedule;
	export let scheduleDate: Date = new Date();
	export let selectedVariation: string;
	$: cachedSchedule = createCachedSchedule(schedule, scheduleDate);

	//NOTE(josh): if this component starts acting wacky it's probably because of the global transition
</script>

{#if cachedSchedule != null}
	<div class="schedule-view transition" id="schd-view" transition:scale|global>
		<span class="schedule-title" id="schedule-title">
			Schedule for {cachedSchedule?.events[0].startTimeDate.toLocaleString('en-US', {
				month: 'long',
				day: 'numeric'
			})}
		</span>
		<table class="schedule-table" id="schedule-table">
			<tbody>
				<!-- <p>{JSON.stringify(cachedSchedule, null, 2)}</p> -->
				{#each cachedSchedule.events.filter((e) => schedule.variations.length == 0 || e.variations.includes(selectedVariation)) as event}
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
{/if}
