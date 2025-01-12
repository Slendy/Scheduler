<script lang="ts">
	import { run } from 'svelte/legacy';

	import UserPermissionForm from '$lib/components/UserPermissionForm.svelte';
	import { EnvironmentPermissions } from '$lib/shared/permissions';
	import { slide } from 'svelte/transition';

	let { data = $bindable() } = $props();

	let selectedUser: any;
	let selectedUserId = $derived(selectedUser?._id?.toString());
	let selectedPermissionPreset: string = 'viewer';
	let newUserPermissions: EnvironmentPermissions = $state(EnvironmentPermissions.ReadOnly);
	run(() => {
		if (selectedPermissionPreset == 'viewer') {
			newUserPermissions = EnvironmentPermissions.ReadOnly;
		} else if (selectedPermissionPreset == 'editor') {
			newUserPermissions = EnvironmentPermissions.Editor;
		} else if (selectedPermissionPreset == 'admin') {
			newUserPermissions = EnvironmentPermissions.Admin;
		}
	});

	let displayNewCollaborator: boolean = $state(false);
	let errorMessage: string | undefined;
</script>

<h3>Collaborators</h3>
<p class="text-body-secondary">Add other users to edit or view this environment</p>
<hr />

<button class="btn btn-secondary" onclick={() => (displayNewCollaborator = true)}>
	Add collaborator
</button>
<!-- TODO: turn add collaborator into a modal -->

<div class="table-responsive mt-2">
	<table class="table">
		<thead>
			<tr>
				<th scope="col">User Id</th>
				<th scope="col">Username</th>
				<th scope="col">Role</th>
				<th scope="col">Edit</th>
			</tr>
		</thead>
		<tbody>
			{#if data.environment?.environmentCollaborators?.length || 0 > 0}
				{#each data.environment.environmentCollaborators as collaborator}
					<tr>
						<td>{collaborator.user._id}</td>

						<td>{collaborator.user.username}</td>

						<td>{EnvironmentPermissions.toPrettyString(collaborator.permissions)}</td>

						<td
							><button
								style="border: none; padding: 0; outline: inherit; background: none; text-decoration: underline;"
								data-bs-toggle="modal"
								data-bs-target="#edit-user"
								onclick={() => {
									data.collaboratorModalUser = collaborator;
									document.dispatchEvent(new CustomEvent('modalChange'));
								}}
							>
								Edit permissions
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

{#if displayNewCollaborator}
	<div transition:slide>
		<hr class="mt-3" />
		<h5 class="mb-2">Add new user</h5>
		<UserPermissionForm
			url={`/api/v1/admin/environments/id/${data.environment._id}/collaborators/add`}
		/>
		<!-- <ErrorAlert message={errorMessage}></ErrorAlert>
		<EnhancedForm
			succeed={() => {
				displayNewCollaborator = false;
				invalidateAll();
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
		</EnhancedForm> -->
	</div>
{/if}
