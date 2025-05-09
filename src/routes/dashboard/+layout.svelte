<script lang="ts">
	import DashboardPage from '$lib/components/scheduler/dashboard/dashboard-page.svelte'

	let { children } = $props();
</script>

<DashboardPage>
	{@render children?.()}
</DashboardPage>