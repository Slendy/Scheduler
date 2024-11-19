<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string | null = null;

	let content: HTMLHeadingElement;
	let text: string;
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
		<slot name="left"></slot>
	</div>
	<div class="col">
		<h1 class="fw-bold text-center mb-0" bind:this={content}><slot></slot></h1>
	</div>
	<div class="col d-flex justify-content-center justify-content-md-end align-items-center">
		<slot name="right"></slot>
	</div>
</div>
<hr class="mb-3" />
