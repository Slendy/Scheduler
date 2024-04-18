<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Header>Users</Header>

{#await data.users}
	<h4>Loading users...</h4>
{:then users}
	<div class="mb-3">
		<h4>There are {users.length} users</h4>
	</div>
	<div class="row row-cols-1 row-cols-sm-auto g-4">
		{#each users as user}
			<UserCard
				userId={user._id}
				isAdmin={user.isAdmin}
				permissionMap={user.permissionMap}
				username={user.username}
			/>
		{/each}
	</div>
{:catch error}
	<h4>Error: {error.body.message}</h4>
{/await}
