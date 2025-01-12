<script lang="ts">
	import { page } from '$app/stores';
	import Modal from '$lib/components/modal/Modal.svelte';
	import SettingsSidebar from '$lib/components/SettingsSidebar.svelte';
	import { onMount } from 'svelte';
	import UserPermissionForm from '$lib/components/UserPermissionForm.svelte';
	import EnvironmentBlockout from '$lib/components/EnvironmentBlockout.svelte';
	let { data, children } = $props();

	let items = [
		{
			display: 'General',
			href: `/admin/environments/${data.environment._id}/edit`
		},
		{
			display: 'Appearance',
			href: `/admin/environments/${data.environment._id}/edit/appearance`
		},
		{
			display: 'Collaborators',
			href: `/admin/environments/${data.environment._id}/edit/collaborators`
		},
		{
			display: 'Blockouts',
			href: `/admin/environments/${data.environment._id}/edit/blockouts`
		}
	];

	let modalRefresher = $state(false);

	onMount(() => {
		// TODO: display modals from a nested element without sacrificing my sanity
		document.addEventListener('modalChange', () => {
			modalRefresher = !modalRefresher;
		});
	});

	/* TODO: when the layout changes the state of the slot component is reset.
	 * There doesn't seem to be an easy way to prevent this with layouts, maybe
	 * it will be fixed in Svelte 5
	 */
</script>

<Modal modalId={'edit-user'} size="modal-lg">
	{#key modalRefresher}
		<div class="modal-header">
			<p>Edit permissions for {$page.data.collaboratorModalUser?.user?.username}</p>
			<button
				onclick={() => {
					alert(JSON.stringify($page.data));
				}}
			></button>
		</div>
		<div class="modal-body">
			<UserPermissionForm url={'/'} user={$page.data.collaboratorModalUser} />
		</div>
	{/key}
</Modal>
<Modal modalId={'blockout'}>
	{#key modalRefresher}
		<div class="modal-header">
			<h4 class="mb-0">
				{#if $page.data.blockoutModal}
					Edit blockout
				{:else}
					Add new blockout
				{/if}
			</h4>

			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
			<EnvironmentBlockout />
		</div>
	{/key}
</Modal>

<div class="row row-cols-1 row-cols-md-3 flex-column-reverse flex-md-row">
	<div class="col d-flex justify-content-center justify-content-md-start align-items-center">
		<a href="/admin/environments/{data.environment._id}" class="btn btn-secondary m-1 mt-2">
			Go back
		</a>
	</div>
	<div class="col text-center">
		<h1>Environment settings</h1>
	</div>
	<div class="col d-flex justify-content-center justify-content-md-end align-items-center"></div>
</div>
<p class="text-body-secondary text-center m-0">Manage the settings of this environment</p>

<hr class="mb-4" />

<div class="d-block d-md-none">
	<div class="d-flex mb-3">
		<div class="sidebar list-group list-group-horizontal overflow-x-scroll">
			<SettingsSidebar {items} />
		</div>
	</div>
	<div class="container-fluid">
		{@render children?.()}
	</div>
</div>
<div class="row d-none d-md-flex">
	<div class="col col-auto col-md-3">
		<div class="sidebar list-group list-group-flush flex-md-column flex-row">
			<SettingsSidebar {items} />
		</div>
	</div>
	<div class="col">
		{@render children?.()}
	</div>
</div>
