<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		message?: string | null;
	}

	let { message = null }: Props = $props();
</script>

{#if message}
	<div class="alert alert-success" role="alert" transition:slide>
		<h4 class="alert-heading">Success</h4>
		<hr />
		{message}
	</div>
{/if}
