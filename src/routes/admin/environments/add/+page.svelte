<script lang="ts">
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
    import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';

    export let formError = "";
</script>

<Header>Create new environment</Header>

<ErrorAlert message={formError} />

<form method="post" action="/api/v1/environments/add" use:enhance={() => {
    return async ({ result }) =>  {
        // pretty sure this isn't how you're supposed to use enhanced forms but fuck it we ball
        if(!result['success']){
            formError = result['message'];
        } else {
            goto(`/admin/environments/${result.environment._id}`);
        }
    }
}}
>
	<div class="mb-3">
		<label for="envName" class="form-label">Environment name</label>
		<input type="text" id="envName" name="envName" class="form-control" maxlength="64" required />
	</div>

	<div class="mb-3">
		<label for="envDomain" class="form-label">Environment domain</label>
		<input type="text" id="envDomain" name="envDomain" class="form-control" required />
	</div>

	<button class="btn btn-secondary" type="submit">Create environment</button>
	<a href="/admin/environments" class="btn btn-danger">Discard changes</a>
</form>
