<script lang="ts">
	export let modalId;
</script>

<div
	class="modal fade"
	id={modalId}
	tabindex="-1"
	aria-labelledby="{modalId}-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<slot></slot>
		</div>
	</div>
</div>
