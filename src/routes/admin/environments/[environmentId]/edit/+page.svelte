<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import SuccessAlert from '$lib/components/SuccessAlert.svelte';
	import { timeZoneNames } from '$lib/shared/timezones.js';

	export let data;

	let submitting = false;

	let formError: string | null = null;
	let formSuccess: string | null = null;
</script>

<h3>Settings</h3>
<p class="text-body-secondary">General settings for this environment</p>
<hr />

<ErrorAlert message={formError} />

<SuccessAlert message={formSuccess} />

<EnhancedForm
	bind:submitting
	action={`/api/v1/admin/environments/id/${data.environment._id}/edit`}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={async (result) => {
		formSuccess = "The environment settings have been successfully updated.";
		invalidateAll();
		setTimeout(() => {
			formSuccess = null;
		}, 3000);
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

	<div class="mb-3">
		<label for="envTimeZone" class="form-label">Environment time zone</label>
		<select
			class="form-select"
			aria-label="Timezone select"
			id="envTimeZone"
			name="envTimeZone"
			value={data.environment.timeZone || 'Select time zone'}
		>
			<option selected={data.environment.timeZone == null} disabled hidden>Select time zone</option>
			{#each timeZoneNames as timeZone}
				<option selected={timeZone.name == data.environment.timeZone} value={timeZone.name}>
					{timeZone.name}
					({timeZone.offset})
				</option>
			{/each}
		</select>
	</div>

	<button class="btn btn-secondary" class:disabled={submitting} type="submit">Save changes</button>
</EnhancedForm>
