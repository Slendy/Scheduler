<script lang="ts">
	import RadioSelector from '$lib/components/RadioSelector.svelte';

	let dateType = 'one-time';
</script>

<div class="text-center">
	<h5 class="fw-bold mb-3">Blockout type</h5>

	<RadioSelector
		name="date-type"
		bind:value={dateType}
		options={[
			{ label: 'One-time', id: 'one-time' },
			{ label: 'Repeating', id: 'repeating' },
			{ label: 'Holiday', id: 'holiday' }
		]}
	/>
</div>
<div class="mb-3"></div>

{#if dateType == 'one-time'}
	<p>Date picker</p>
{:else if dateType == 'repeating'}
	<p>Date picker with repeating frequency</p>
{:else if dateType == 'holiday'}
	<p>Holiday selector</p>
{/if}

<div class="text-end">
	<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">
		Discard changes
	</button>
	<button class="btn btn-outline-success">Save changes</button>
</div>
