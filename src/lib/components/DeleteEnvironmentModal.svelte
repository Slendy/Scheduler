<script lang="ts">
	import { onMount } from "svelte";

    export let environmentName: string;

    let deleteInput: string;
    //TODO: figure out how to route the post to a /api handler
</script>

<div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <form method="post">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">Are you sure you want to delete this environment?</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="confirm-text" class="form-label">Type '{environmentName}' below to confirm deletion</label>
                    <input bind:value={deleteInput} type="text" id="confirm-text" name="confirmName" class="form-control"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button
                        type="submit"
                        class="btn btn-danger"
                        class:disabled={deleteInput != environmentName}
                        data-bs-dismiss="modal"
                        id="delete-confirmation">
                        Delete {environmentName} environment
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>