<script lang="ts">
import type { PageData } from './$types';
import Header from '$lib/components/Header.svelte'

export let data: PageData
</script>


<Header>Scheduler</Header>

<h3>Running {data.stats.totalEnvironments} environments with {data.stats.totalUsers} users</h3>