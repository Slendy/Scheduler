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
	<title>{text || "Scheduler"}</title>
</svelte:head>

<div class="row row-cols-1 row-cols-md-3 mb-5">
	<div class="col">
        <slot name="left"></slot>
	</div>
	<div class="col">
		<h1 class="fw-bold text-center" bind:this={content}><slot></slot></h1>
	</div>
	<div class="col d-flex justify-content-end align-items-center">
        <slot name="right"></slot>
	</div>
</div>