<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';

	export let formError = '';
</script>

<Header>Create new environment</Header>

<ErrorAlert message={formError} />

<EnhancedForm
	action={'/api/v1/environments/add'}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={(result) => {
		goto(`/admin/environments/${result.environment._id}`);
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
</EnhancedForm>
