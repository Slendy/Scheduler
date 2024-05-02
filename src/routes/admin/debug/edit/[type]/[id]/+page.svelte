<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
    import ErrorAlert from '$lib/components/ErrorAlert.svelte'
	
    let error = '';
	export let data;
    let jsonData = data.serialized;
</script>

<ErrorAlert message={error} />

<form
	method="post"
	use:enhance={() => {
        return async ({ result }) => {
            if(result.type === 'error'){
                error = result.error.message;
            } else if(result.type === 'success'){
                await goto("/admin/debug");
            }
        }
    }}
	on:submit|preventDefault={(e) => {
		try {
			let data = JSON.parse(jsonData);
		} catch (error) {
			e.stopImmediatePropagation();

		}
	}}
>
	<div class="mb-3">
		<label for="serialized-data">Data</label>
		<textarea
			class="form-control"
			name="serialized-data"
			rows="20"
			id="json-data"
            data-gramm="false"
			bind:value={jsonData}></textarea
		>
		<hr />
		<button type="submit" class="btn btn-secondary">Save Changes</button>
		<a href="/admin/debug" class="btn btn-danger">Discard Changes</a>
	</div>
</form>
