<script lang="ts">
	import moment from 'moment';

	export let environmentId: string;
	export let scheduleId: string;
	export let scheduleType: any;
	export let name: string;
	export let isPublished: boolean;
	export let events: [any];
	export let updatedAt: string;
	export let createdAt: string;
</script>

<div class="col">
	<div class="card" style="width: 18rem;">
		<div class="card-header">
			{name}
		</div>
		<ul class="card-body mb-0">
			<p class="card-text">
				<span class="card-text fw-bold">Schedule Id:</span>
				<span class="card-text">{scheduleId}</span>
			</p>
			<p class="card-text">
				<span class="card-text fw-bold">Schedule Type:</span>
				{#if scheduleType === 'one-time'}
					<span class="card-text">One time</span>
				{:else}
					<span class="card-text">Repeating</span>
				{/if}
			</p>
			<p class="card-text">
				<span class="card-text fw-bold">Published?:</span>
				<span class="card-text">{isPublished || false}</span>
			</p>
			<p class="card-text">
				<span class="card-text fw-bold"># Events:</span>
				<span class="card-text">{events.length}</span>
			</p>

			{#if createdAt != null && updatedAt != null}
				<small class="d-block text-body-secondary">
					Last updated {moment(updatedAt).fromNow()}
				</small>
				<small class="d-block text-body-secondary mb-3">
					Created {moment(createdAt).fromNow()}
				</small>
			{/if}

			<a href="/admin/environments/{environmentId}/schedule/{scheduleId}" class="btn btn-secondary">
				View Schedule
			</a>
		</ul>
	</div>
</div>
