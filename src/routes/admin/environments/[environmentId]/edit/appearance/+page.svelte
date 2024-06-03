<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import SuccessAlert from '$lib/components/SuccessAlert.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';

	export let data;

	let submitting = false;

	let formError: string | null = null;
	let formSuccess: string | null = null;

	let environmentFiles: FileList | undefined;
	$: {
		if (environmentFiles) {
			environmentFiles
				?.item(0)
				?.arrayBuffer()
				?.then((buf) => {
					environmentIconInput = btoa(
						new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), '')
					);
				});
		}
	}
	let environmentIconInput: any;
	$: environmentIcon = environmentIconInput || data.environment.environmentIcon;
</script>

<h3>Appearance</h3>
<p class="text-body-secondary">Customize the way your environment looks</p>
<hr />

<ErrorAlert message={formError} />

<SuccessAlert message={formSuccess} />

<EnhancedForm
	bind:submitting
	encType={'multipart/form-data'}
	action={`/api/v1/admin/environments/id/${data.environment._id}/edit/appearance`}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={async (_) => {
		formSuccess = 'The environment settings have been successfully updated.';
		invalidateAll();
		setTimeout(() => {
			formSuccess = null;
		}, 3000);
	}}
>
	<label for="favicon" class="form-label">Environment favicon</label>
	<div class="input-group">
		<input
			type="file"
			class="form-control"
			id="favicon"
			name="envIcon"
			accept="image/png, image/jpeg"
			bind:files={environmentFiles}
		/>
	</div>
	<div class="form-text">The icon that will be displayed in the tab preview</div>
	{#if environmentIcon != null}
		<div class="mb-3 mt-3">
			<img
				src="data:image;base64,{environmentIcon}"
				width="128"
				height="128"
				alt="Environment favicon"
			/>
		</div>
	{/if}

	<button class="btn btn-secondary" class:disabled={submitting} type="submit">Save changes</button>
</EnhancedForm>
