<script lang="ts">
	import { goto } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import Header from '$lib/components/Header.svelte';
	import { timeZoneNames } from '$lib/shared/timezones.js';

	export let data;

	let submitting = false;

	export let formError: string | null = null;
</script>

<Header>Edit {data.environment.environmentName}</Header>

<ErrorAlert message={formError} />

<EnhancedForm
	bind:submitting
	action={`/api/v1/admin/environments/id/${data.environment._id}/edit`}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={async (result) => {
		await goto(`/admin/environments/${result._id}`);
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
			value={data.environment.timeZone || 'Select timezone'}
		>
			<option selected={data.environment.timeZone == null} disabled hidden>Select time zone</option>
			{#each timeZoneNames as timeZone}
				<option selected={timeZone == data.environment.timeZone} value={timeZone.name}>
					{timeZone.name}
					({timeZone.offset})
				</option>
			{/each}
		</select>
	</div>

	<button class="btn btn-secondary" class:disabled={submitting} type="submit">Save changes</button>
	<a
		href="/admin/environments/{data.environment._id}"
		class="btn btn-danger"
		class:disabled={submitting}>Discard changes</a
	>
</EnhancedForm>
