<script lang="ts">
	import { slide } from 'svelte/transition';

	interface Props {
		message?: string | null;
		messages?: string[] | null;
	}

	let { message = null, messages = null }: Props = $props();
</script>

{#if message}
	<div class="alert alert-danger" role="alert" transition:slide>
		<h4 class="alert-heading">Error</h4>
		<hr />
		{message}
	</div>
{:else if messages && messages.length > 0}
	<div class="alert alert-danger" role="alert" transition:slide>
		<h4 class="alert-heading">Error</h4>
		<hr />
		<ul class="mb-0">
			{#each messages as message}
			<li>
				{message}
			</li>
			{/each}
		</ul>
	</div>
{/if}
