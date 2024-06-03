<script lang="ts">
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import RadioSelector from '$lib/components/RadioSelector.svelte';
	import UserSearch from '$lib/components/UserSearch.svelte';
	import { scale, slide } from 'svelte/transition';

	export let data;

	let selectedUser: any;
    let newUserPermissions: string = "viewer";
	let displayNewCollaborator: boolean = false;
</script>

<h3>Collaborators</h3>
<p class="text-body-secondary">Add other users to edit or view this environment</p>
<hr />

{#if data.environment?.environmentCollaborators?.length || 0 > 0}
	<p>rows go here</p>
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
		<h5>Add new user</h5>
		<EnhancedForm
			succeed={() => {
				displayNewCollaborator = false;
			}}
			action="/api/v1/admin/TODO"
			onSubmit={() => {

            }}
		>
			<div class="mb-3">
				<UserSearch bind:selectedUser />
			</div>

            <h5>Permissions</h5>
            <RadioSelector name="permissionPreset" bind:value={newUserPermissions} options={[{id: 'viewer', label: 'Read-Only'}, {id: 'editor', label: 'Editor'}, {id: 'admin', label: 'Admin'}, {id: 'custom', label: 'Custom'}]} ></RadioSelector>
            <div class="d-flex">
                
            </div>
		</EnhancedForm>
	</div>
{/if}
