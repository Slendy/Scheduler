<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	export let formError: string | null = null;
</script>

<Header>Edit {data.user.username}</Header>

<ErrorAlert message={formError} />

<form
	method="post"
	action="/api/v1/users/id/{data.user._id}/edit"
	use:enhance={() => {
		return async ({ result }) => {
			if (!result['success']) {
				formError = result['message'];
			} else {
				goto(`/admin/users/`);
			}
		};
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
</form>
