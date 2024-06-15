<script lang="ts">
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import PermissionSelector from '$lib/components/PermissionSelector.svelte';
	import RadioSelector from '$lib/components/RadioSelector.svelte';
	import UserSearch from '$lib/components/UserSearch.svelte';
	import { EnvironmentPermissions } from '$lib/shared/permissions.js';
	import { slide } from 'svelte/transition';

	export let data;

	let selectedUser: any;
	$: selectedUserId = selectedUser?._id?.toString();
	let selectedPermissionPreset: string = 'viewer';
	let newUserPermissions: EnvironmentPermissions;
	$: {
		if (selectedPermissionPreset == 'viewer') {
			newUserPermissions = EnvironmentPermissions.ReadOnly;
		} else if (selectedPermissionPreset == 'editor') {
			newUserPermissions = EnvironmentPermissions.Editor;
		} else if (selectedPermissionPreset == 'admin') {
			newUserPermissions = EnvironmentPermissions.Admin;
		}
	}
	let displayNewCollaborator: boolean = false;
	let errorMessage: string | undefined;
</script>

<h3>Collaborators</h3>
<p class="text-body-secondary">Add other users to edit or view this environment</p>
<hr />

{#if data.environment?.environmentCollaborators?.length || 0 > 0}
	{#each data.environment.environmentCollaborators as collaborator}
		<p>{collaborator.userId}</p>
	{/each}
	<hr />
{/if}

<div class="text-center">
	<button class="btn btn-secondary" on:click={() => (displayNewCollaborator = true)}>
		Add collaborator
	</button>
</div>

{#if displayNewCollaborator}
	<div transition:slide>
		<hr class="mt-3" />
		<h5 class="mb-2">Add new user</h5>
		<ErrorAlert message={errorMessage}></ErrorAlert>
		<EnhancedForm
			succeed={() => {
				displayNewCollaborator = false;
			}}
			fail={(error) => {
				errorMessage = error.message;
			}}
			action="/api/v1/admin/environments/id/{data.environment._id}/collaborators/add"
			onSubmit={() => {
				if (!selectedUser) {
					errorMessage = 'You must select a valid user';
					return false;
				}
			}}
		>
			<div class="mb-3">
				<UserSearch bind:selectedUser />
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
					bind:permissions={newUserPermissions}
					onChange={() => (selectedPermissionPreset = 'custom')}
				/>
			</div>
			<input type="hidden" bind:value={newUserPermissions} name="permissions" />
			<input type="hidden" bind:value={selectedUserId} name="userId" />

			<div class="mt-3">
				<button type="submit" class="btn btn-secondary">Add user</button>
				<button
					type="button"
					class="btn btn-danger"
					on:click={() => {
						newUserPermissions = EnvironmentPermissions.ReadOnly;
						selectedPermissionPreset = 'viewer';
						selectedUser = undefined;
						displayNewCollaborator = false;
					}}
				>
					Cancel
				</button>
			</div>
		</EnhancedForm>
	</div>
{/if}
