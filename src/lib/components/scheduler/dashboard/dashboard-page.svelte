<script lang="ts">

	import { page } from '$app/state';

	let { children } = $props();
	import DashboardMainNav from '$lib/components/scheduler/dashboard/main-nav.svelte';
	import EnvironmentSelector from '$lib/components/scheduler/dashboard/environment-selector.svelte';

	let environments = page.data.environments;
</script>

<div class="border-b">
	<div class="flex h-16 items-center px-4">
		<EnvironmentSelector environments={environments} />
		<DashboardMainNav class="mx-6" />
		<div class="ml-auto flex items-center space-x-4">
			<!--			<Search />-->
			<!--			<UserNav />-->
		</div>
	</div>
</div>

<div class="flex-1 py-1 px-4 pt-6">
	<div class="flex flex-col gap-y-6">
		<div class="flex">
			<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
		</div>
		<div>
			{@render children?.()}
		</div>
	</div>

</div>
