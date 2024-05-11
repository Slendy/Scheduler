<script lang="ts">
	import NProgress from 'nprogress';

	export let data;
    
	NProgress.done();
</script>

<svelte:head>
    <link href="/css/overrides.css" rel="stylesheet" />
</svelte:head>

<div class="overlay-container transition">
	<span class="overlay">You are currently in preview mode</span>
	<a href="/admin/environments/{data.environment._id}" class="overlay-link overlay">Exit preview mode</a>
</div>

<slot />

<style>
	.overlay-link {
		font-family: 'Open Sans', 'Helvetica', serif;
		color: var(--schedule-text);
	}
	.overlay-container {
		display: flex;
		flex-wrap: wrap;
		text-align: center;
		column-gap: 5em;
		row-gap: 1em;
		position: absolute;
		z-index: 999;
		align-items: center;
		justify-content: space-around;
		top: 0;
		left: 50%;
		transform: translate(-50%, 25%);
		background-color: var(--schedule-accent-color);
		padding: 1em;
        border-radius: 1em;
        border: 1px solid var(--schedule-scheduleborder);
		color: var(--schedule-text-color);
	}

	.overlay {
		display: flex;
		text-align: center;
		font-family: 'Open Sans', 'Helvetica', serif;
		min-width: fit-content;
	}
</style>
