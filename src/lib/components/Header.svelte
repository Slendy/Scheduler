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
</script>

<svelte:head>
	<title>{text}</title>
</svelte:head>

<h1 class="text-center mb-5" bind:this={content}><slot></slot></h1>
