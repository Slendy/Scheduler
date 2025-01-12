<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		title?: string | null;
		left?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		right?: import('svelte').Snippet;
	}

	let {
		title = null,
		left,
		children,
		right
	}: Props = $props();

	let content: HTMLHeadingElement = $state();
	let text: string = $state();
	onMount(() => {
		if (title !== null) {
			text = title;
		} else {
			text = content.textContent || '';
		}
	});
	//TODO: make items in left and right centered in small breakpoints
</script>

<svelte:head>
	<title>{text || 'Scheduler'}</title>
</svelte:head>

<div class="row row-cols-1 row-cols-md-3 flex-column flex-md-row">
	<div class="col d-flex justify-content-center justify-content-md-start align-items-center">
		{@render left?.()}
	</div>
	<div class="col">
		<h1 class="fw-bold text-center mb-0" bind:this={content}>{@render children?.()}</h1>
	</div>
	<div class="col d-flex justify-content-center justify-content-md-end align-items-center">
		{@render right?.()}
	</div>
</div>
<hr class="mb-3" />
