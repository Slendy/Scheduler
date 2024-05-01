<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import EnhancedForm from '../EnhancedForm.svelte';
	import Modal from './Modal.svelte';

	export let scheduleId: string;
	export let scheduleName: string;
	export let environmentId: string;

	let submitting = false;
</script>

<Modal modalId={'scheduleDeleteConfirmation'}>
	<EnhancedForm
		bind:submitting
		action={`/api/v1/admin/environments/id/${environmentId}/schedule/id/${scheduleId}/delete`}
		succeed={invalidateAll}
	>
		<div class="modal-header">
			<h1 class="modal-title fs-5" id="deleteModalLabel">
				Are you sure you want to delete this schedule?
			</h1>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
			<div class="d-flex justify-content-center">
				<div class="m-1">
					<button
						type="button"
						class="btn btn-secondary"
						class:disabled={submitting}
						data-bs-dismiss="modal"
					>
						Cancel
					</button>
				</div>
				<div class="m-1">
					<button
						type="submit"
						class="btn btn-danger"
						class:disabled={submitting}
						data-bs-dismiss="modal"
						id="delete-confirmation"
					>
						Delete {scheduleName}
					</button>
				</div>
			</div>
		</div>
	</EnhancedForm>
</Modal>
