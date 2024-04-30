<script lang="ts">
	import { goto } from '$app/navigation';
	import EnhancedForm from '../EnhancedForm.svelte';
	import Modal from './Modal.svelte';

	export let environmentName: string;
	export let environmentId: string;

	let submitting = false;

	let deleteInput: string;
</script>

<Modal modalId={'deleteConfirmationModal'}>
	<EnhancedForm
		bind:submitting
		action={`/api/v1/admin/environments/id/${environmentId}/delete`}
		onSubmit={(e) => {
			if (deleteInput != environmentName) {
				e.stopImmediatePropagation();
			}
		}}
		succeed={() => {
			goto('/admin/environments');
		}}
	>
		<div class="modal-header">
			<h1 class="modal-title fs-5" id="deleteModalLabel">
				Are you sure you want to delete this environment?
			</h1>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
			<label for="confirm-text" class="form-label"
				>Type '{environmentName}' below to confirm deletion</label
			>
			<input
				bind:value={deleteInput}
				type="text"
				id="confirm-text"
				name="confirmName"
				class="form-control"
			/>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" class:disabled={submitting} data-bs-dismiss="modal">Cancel</button>
			<button
				type="submit"
				class="btn btn-danger"
				class:disabled={deleteInput != environmentName || submitting}
				data-bs-dismiss="modal"
				id="delete-confirmation"
			>
				Delete {environmentName} environment
			</button>
		</div>
	</EnhancedForm>
</Modal>
