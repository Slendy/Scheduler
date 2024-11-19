<script lang="ts">
	import { slide } from 'svelte/transition';

	export let message: string | null = null;
</script>

{#if message}
	<div class="alert alert-success" role="alert" transition:slide>
		<h4 class="alert-heading">Success</h4>
		<hr />
		{message}
	</div>
{/if}
