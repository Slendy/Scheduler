<script lang="ts">
	import { EnvironmentPermissions } from '$lib/shared/permissions';

	let permissionDescriptions: {
		permissionBit: EnvironmentPermissions;
		label: string;
		description: string;
	}[] = [
		{
			permissionBit: EnvironmentPermissions.ViewEnvironment,
			label: 'View environment',
			description: 'Allows a user to see this environment.'
		},
		{
			permissionBit: EnvironmentPermissions.ViewSchedules,
			label: 'View schedule',
			description: 'Allows a user to see the events and variations of a schedule.'
		},
		{
			permissionBit: EnvironmentPermissions.EditSchedules,
			label: 'Edit schedules',
			description: 'Allows a user to make changes to pre-existing schedules.'
		},
		{
			permissionBit: EnvironmentPermissions.CreateSchedules,
			label: 'Create schedules',
			description: 'Allows a user to create new schedules.'
		},
		{
			permissionBit: EnvironmentPermissions.EditBlockouts,
			label: 'Edit blockouts',
			description: 'Allows a user to manage schedule blockouts for this environment.'
		},
		{
			permissionBit: EnvironmentPermissions.EditEnvironment,
			label: 'Edit environment',
			description: 'Allows a user to make changes to all settings of this environment.'
		},
		{
			permissionBit: EnvironmentPermissions.DeleteEnvironment,
			label: 'Delete environment',
			description: 'Allows a user to permanently delete the environment.'
		},
		{
			permissionBit: EnvironmentPermissions.DeleteSchedules,
			label: 'Delete schedules',
			description: 'Allows a user to permanently delete schedules.'
		}
	];

	export let permissions: EnvironmentPermissions;
	export let onChange: () => any = () => {};

	function handleClick(event: any, permission: any) {
		onChange();

		if (event.target.checked) {
			permissions |= permission.permissionBit;
		} else {
			permissions &= ~permission.permissionBit;
		}
	}
</script>

{#each permissionDescriptions as permission}
	<div class="form-check form-switch">
		<input
			class="form-check-input"
			type="checkbox"
			id={permission.label.replace(/\s/g, '')}
			value={permission.permissionBit}
			checked={(permissions & permission.permissionBit) == permission.permissionBit}
			on:click={(e) => handleClick(e, permission)}
		/>
		<label class="form-check-label" for={permission.label.replace(/\s/g, '')}>
			{permission.label}
		</label>
	</div>
    <p class="mb-1 text-body-secondary" style="margin-left: 2.5rem">{permission.description}</p>
{/each}
