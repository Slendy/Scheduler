<script lang="ts">
	interface Props {
		modalId: any;
		size?: '' | 'modal-xl' | 'modal-lg' | 'modal-sm';
		children?: import('svelte').Snippet;
	}

	let { modalId, size = '', children }: Props = $props();
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
			{@render children?.()}
		</div>
	</div>
</div>
