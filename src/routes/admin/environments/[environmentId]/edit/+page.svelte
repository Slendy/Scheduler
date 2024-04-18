<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

    export let formError: string | null = null;
</script>

<Header>Edit {data.environment.environmentName}</Header>

<ErrorAlert message={formError} />

<form
	method="post"
	action="/api/v1/environments/id/{data.environment._id}/edit"
	use:enhance={() => {
		return async ({ result }) => {
			if (!result['success']) {
				formError = result['message'];
			} else {
				goto(`/admin/environments/${result.environment._id}`);
			}
		};
	}}
>
	<div class="mb-3">
		<label for="envName" class="form-label">Environment name</label>
		<input
			type="text"
			value={data.environment.environmentName}
			id="envName"
			name="envName"
			class="form-control"
			maxlength="64"
		/>
	</div>

	<div class="mb-3">
		<label for="envDomain" class="form-label">Environment domain</label>
		<input
			type="text"
			value={data.environment.environmentDomain}
			id="envDomain"
			name="envDomain"
			class="form-control"
		/>
	</div>

	<button class="btn btn-secondary" type="submit">Save changes</button>
	<a href="/admin/environments/{data.environment._id}" class="btn btn-danger">Discard changes</a>
</form>
