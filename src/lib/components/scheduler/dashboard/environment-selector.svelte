<script lang="ts">
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import Check from 'svelte-radix/Check.svelte';
	import PlusCircled from 'svelte-radix/PlusCircled.svelte';

	import { tick } from 'svelte';
	import { cn } from '$lib/utils.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { goto } from '$app/navigation';

	let className: string | undefined | null = $state(undefined);
	export { className as class };

	// const groups = [
	// 	{
	// 		label: 'Personal Account',
	// 		teams: [
	// 			{
	// 				label: 'Alicia Koch',
	// 				value: 'personal'
	// 			}
	// 		]
	// 	},
	// 	{
	// 		label: 'Teams',
	// 		teams: [
	// 			{
	// 				label: 'Acme Inc.',
	// 				value: 'acme-inc'
	// 			},
	// 			{
	// 				label: 'Monsters Inc.',
	// 				value: 'monsters'
	// 			}
	// 		]
	// 	}
	// ];
	//
	// type Team = (typeof groups)[number]['teams'][number];

	let { environments, selectedEnvironment = $bindable(environments[0]) }: {
		environments: {name: string, id: string}[]
		selectedEnvironment: any,
	} = $props();

	// console.log();

	let open = $state(false);
	let showTeamDialog = $state(false);

	// let selectedEnvironment = $state(environments[0]);

	function closeAndRefocusTrigger(triggerId: string) {
		open = false;

		tick().then(() => document.getElementById(triggerId)?.focus());
	}
</script>

<Dialog.Root bind:open={showTeamDialog}>
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a team"
					class={cn("w-[200px] justify-between cursor-pointer", className)}
					{...props}
				>
					<Avatar.Root class="mr-2 h-5 w-5">
						<Avatar.Image
							src="data:image/png;base64, {selectedEnvironment.icon}"
							alt={selectedEnvironment.name}
							class=""
						/>
						<Avatar.Fallback>{selectedEnvironment.name.slice(0, 1)}</Avatar.Fallback>
					</Avatar.Root>
					{selectedEnvironment.name}
					<CaretSort class="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search environment..." />
				<Command.List>
					<Command.Empty>No team found.</Command.Empty>
					{#each environments as environment}
<!--						<Command.Group heading={environment.name}>-->
							<!--{#each group.teams as team}-->
								<Command.Item
									onSelect={() => {
										console.log(open);
										selectedEnvironment = environment;
										open = false;
									}}
									value={environment.name}
									class="text-sm cursor-pointer"
								>
									<Avatar.Root class="mr-2 h-5 w-5">
										<Avatar.Image
											src="data:image/png;base64, {environment.icon}"
											alt={environment.name}
											class=""
										/>
										<Avatar.Fallback>{environment.name.slice(0, 1)}</Avatar.Fallback>
									</Avatar.Root>
									{environment.name}
									<Check
										class={cn(
											"ml-auto h-4 w-4",
											selectedEnvironment.id !== environment.id && "text-transparent"
										)}
									/>
								</Command.Item>
							<!--{/each}-->
<!--						</Command.Group>-->
					{/each}
				</Command.List>
				<Command.Separator />
				<Command.List>
					<Command.Group>
						<Command.Item
							onSelect={() => {
								open = false;
								showTeamDialog = true;
							}}
							class="cursor-pointer"
						>
							<PlusCircled class="mr-2 h-5 w-5" />
							Create Environment
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create team</Dialog.Title>
			<Dialog.Description>
				Add a new team to manage products and customers.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (showTeamDialog = false)}>Cancel</Button>
			<Button type="submit">Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>