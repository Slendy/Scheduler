<script lang="ts">

	let { children } = $props();
	import DashboardMainNav from '$lib/components/main-nav.svelte'
	import TeamSwitcher from '$lib/components/team-selector.svelte'
</script>

<div class="border-b">
	<div class="flex h-16 items-center px-4">
<!--		<TeamSwitcher />-->
		<DashboardMainNav class="mx-6" />
		<div class="ml-auto flex items-center space-x-4">
<!--			<Search />-->
<!--			<UserNav />-->
		</div>
	</div>
</div>

<div class="flex h-screen w-full p-1">
	{@render children?.()}
</div>
