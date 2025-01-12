<script lang="ts">
	import { run } from 'svelte/legacy';

	import { invalidateAll } from '$app/navigation';
	import EnhancedForm from './EnhancedForm.svelte';
	import UserSearch from './UserSearch.svelte';
	import RadioSelector from './RadioSelector.svelte';
	import PermissionSelector from './PermissionSelector.svelte';
	import ErrorAlert from './ErrorAlert.svelte';
	import { EnvironmentPermissions } from '$lib/shared/permissions';

	let errorMessage: string | undefined = $state();
	let selectedUser: any = $state();
	let selectedUserId = $state();
	$effect(() => {
		selectedUserId = selectedUser?._id?.toString();
	});
	let selectedPermissionPreset: string = $state('viewer');
	let userPermissions: EnvironmentPermissions = $state(EnvironmentPermissions.ReadOnly);
	$effect(() => {
		if (selectedPermissionPreset == 'viewer') {
			userPermissions = EnvironmentPermissions.ReadOnly;
		} else if (selectedPermissionPreset == 'editor') {
			userPermissions = EnvironmentPermissions.Editor;
		} else if (selectedPermissionPreset == 'admin') {
			userPermissions = EnvironmentPermissions.Admin;
		}
	});

	interface Props {
		url: string;
		user?: any | undefined;
	}

	let { url, user = undefined }: Props = $props();
</script>

<ErrorAlert message={errorMessage}></ErrorAlert>
<EnhancedForm
	succeed={() => {
		invalidateAll();
	}}
	fail={(error) => {
		errorMessage = error.message;
	}}
	action={url}
	onSubmit={() => {
		if (!selectedUser) {
			errorMessage = 'You must select a valid user';
			return false;
		}
	}}
>
	<div class="mb-3">
		{#if user}
			<p>{user.user.username}</p>
		{:else}
			<UserSearch bind:selectedUser />
		{/if}
	</div>

	<h5>Permissions</h5>
	<RadioSelector
		name=""
		bind:value={selectedPermissionPreset}
		options={[
			{ id: 'viewer', label: 'Read-Only' },
			{ id: 'editor', label: 'Editor' },
			{ id: 'admin', label: 'Admin' },
			{ id: 'custom', label: 'Custom' }
		]}
	/>
	<div class="mt-3">
		<PermissionSelector
			bind:permissions={userPermissions}
			onChange={() => (selectedPermissionPreset = 'custom')}
		/>
	</div>
	<input type="hidden" bind:value={userPermissions} name="permissions" />
	<input type="hidden" bind:value={selectedUserId} name="userId" />

	<div class="mt-3">
		<button type="submit" class="btn btn-secondary">Add user</button>
		<button
			type="button"
			class="btn btn-danger"
			onclick={() => {
				userPermissions = EnvironmentPermissions.ReadOnly;
				selectedPermissionPreset = 'viewer';
				selectedUser = undefined;
			}}
		>
			Cancel
		</button>
	</div>
</EnhancedForm>
