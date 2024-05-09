<script lang="ts">
	import NProgress from 'nprogress';

	export let data;
    
	NProgress.done();
</script>

<svelte:head>
    <link href="/css/overrides.css" rel="stylesheet" />
</svelte:head>

<div class="overlay-container">
	<span class="overlay">You are currently in preview mode</span>
	<a href="/admin/environments/{data.environment._id}" class="overlay-link">Exit preview mode</a>
</div>

<slot />

<style>
	.overlay-link {
		font-family: 'Open Sans', 'Helvetica', serif;
		color: var(--schedule-text);
		padding-left: 5rem;
	}
	.overlay-container {
		display: flex;
		position: absolute;
		align-items: center;
		top: 1;
		left: 50%;
		transform: translate(-50%, 25%);
		background-color: var(--schedule-accent-color);
		padding: 1em;
        border-radius: 1em;
        border: 1px solid var(--schedule-scheduleborder);
	}
	.overlay {
		display: block;
		text-align: center;
		font-family: 'Open Sans', 'Helvetica', serif;
	}
</style>
