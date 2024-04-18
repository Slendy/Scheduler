<script lang="ts">
	export let message: string | null = null;
</script>

{#if message}
	<div class="alert alert-danger" role="alert">
		<h4 class="alert-heading">Error</h4>
		<hr />
		{message}
	</div>
{/if}
