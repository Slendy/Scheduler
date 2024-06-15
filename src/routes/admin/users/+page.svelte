<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import PlaceholderCard from '$lib/components/PlaceholderCard.svelte';
	import UserCard from '$lib/components/UserCard.svelte';

	export let data;
</script>

<Header>Users</Header>

{#await data.users}
	<p class="placeholder-wave">
		<span class="placeholder col-3"></span>
	</p>
	<div class="row row-cols-sm-auto row-cols-1 g-4">
		<PlaceholderCard />
		<PlaceholderCard />
		<PlaceholderCard />
	</div>
{:then users}
	<div class="mb-3">
		<h4>There are {users.length} users</h4>
		<a href="/admin/users/add" class="btn btn-secondary">Add new user</a>
	</div>
	<div class="row row-cols-1 row-cols-sm-auto g-4">
		{#each users as user}
			<UserCard userId={user._id} isAdmin={user.isAdmin} username={user.username} />
		{/each}
	</div>
{:catch error}
	<h4>Error: {error.body.message}</h4>
{/await}
