<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		title?: string | null;
		children?: import('svelte').Snippet;
	}

	let { title = null, children }: Props = $props();

	let content: HTMLHeadingElement | undefined = $state();
	let text: string | undefined = $state();
	onMount(() => {
		if (title !== null) {
			text = title;
		} else {
			text = content?.textContent || '';
		}
	});
</script>

<svelte:head>
	<title>{text || 'Scheduler'}</title>
</svelte:head>

<h1 class="mb-5 text-center" bind:this={content}>{@render children?.()}</h1>
