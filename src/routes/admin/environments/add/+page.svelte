<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { goto } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import { timeZoneNames } from '$lib/shared/timezones.js';

	let formError = '';
	let submitting = false;
</script>

<Header>Create new environment</Header>

<ErrorAlert message={formError} />

<EnhancedForm
	bind:submitting
	action={'/api/v1/admin/environments/add'}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={async (result) => {
		await goto(`/admin/environments/${result.environment._id}`);
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

	<div class="mb-3">
		<label for="envTimeZone" class="form-label">Environment time zone</label>
		<select class="form-select" aria-label="Time zone select" id="envTimeZone" name="envTimeZone">
			<option selected disabled hidden>Select time zone</option>
			{#each timeZoneNames as timeZone}
				<option value={timeZone.name}>
					{timeZone.name}
					({timeZone.offset})
				</option>
			{/each}
		</select>
	</div>

	<button class="btn btn-secondary" class:disabled={submitting} type="submit">
		Create environment
	</button>
	<a href="/admin/environments" class="btn btn-danger" class:disabled={submitting}>
		Discard changes
	</a>
</EnhancedForm>
