<script lang="ts">
	export let modalId;
	export let size: '' | 'modal-xl' | 'modal-lg' | 'modal-sm' = '';
</script>

<div
	class="modal fade"
	id={modalId}
	tabindex="-1"
	aria-labelledby="{modalId}-label"
	aria-hidden="true"
>
	<div class="modal-dialog {size}">
		<div class="modal-content">
			<slot></slot>
		</div>
	</div>
</div>
