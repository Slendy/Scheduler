<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let environmentName: string;
    export let environmentId: string;

	let deleteInput: string;
	//TODO: figure out how to route the post to a /api handler
    function handleSubmit(e) {
        if(deleteInput != environmentName){
            e.stopImmediatePropogation();
        }
    }
</script>

<div
	class="modal fade"
	id="deleteConfirmationModal"
	tabindex="-1"
	aria-labelledby="deleteModalLabel"
	aria-hidden="true"
>
	<form
		method="post"
        action="/api/v1/environments/id/{environmentId}/delete"
        on:submit|preventDefault={(e) => {
            if(deleteInput != environmentName) {
                e.stopImmediatePropagation();
            }
        }}
		use:enhance={() => {
			return async ({ result }) => {
				// pretty sure this isn't how you're supposed to use enhanced forms but fuck it we ball
				if (result['success']) {
					goto("/admin/environments");
				}
			};
		}}
	>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="deleteModalLabel">
						Are you sure you want to delete this environment?
					</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
					></button>
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
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
					<button
						type="submit"
						class="btn btn-danger"
						class:disabled={deleteInput != environmentName}
						data-bs-dismiss="modal"
						id="delete-confirmation"
					>
						Delete {environmentName} environment
					</button>
				</div>
			</div>
		</div>
	</form>
</div>