<script lang="ts">
	import { goto } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import Header from '$lib/components/Header.svelte';

	export let data;

	export let formError: string | null = null;
</script>

<Header>Edit {data.user.username}</Header>

<ErrorAlert message={formError} />

<EnhancedForm
	action={'/api/v1/admin/users/id/' + data.user._id + '/edit'}
	fail={(result) => {
		formError = result.message;
	}}
	succeed={(_) => {
		goto('/admin/users/');
	}}
>
	<div class="mb-3">
		<label for="username" class="form-label">Username</label>
		<input
			type="text"
			value={data.user.username}
			name="username"
			id="username"
			class="form-control"
		/>
	</div>

	<div class="mb-3">
		<label class="form-label" for="password">Password</label>
		<input type="password" id="password" class="form-control" />
	</div>

	<input type="hidden" name="password" />

	<div class="mb-3 form-check form-switch">
		<input
			type="checkbox"
			class="form-check-input"
			id="isAdmin"
			role="switch"
			checked={data.user.isAdmin}
			name="isAdmin"
		/>
		<label for="isAdmin" class="form-check-label">Admin</label>
	</div>

	<button class="btn btn-secondary" type="submit">Save changes</button>
	<a href="/admin/users" class="btn btn-danger">Discard changes</a>
</EnhancedForm>
