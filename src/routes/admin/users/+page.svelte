<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	// async function loadUsers() {
	// 	return await fetch('http://localhost:5001/api/v1/users/list')
	// 		.then((response) => response.json())
	// 		.then((data) => data);
	// }
	// let users = fetch("");
	// let users;
	// onMount(() => {
	//     users = fetch("http://localhost:5001/api/v1/users/list");
	// })
</script>

<Header>Users</Header>

{#await data.users}
	<p>Loading users...</p>
{:then users}
	<div class="mb-3">
		<h4>There are {users.length} users</h4>
	</div>
	<div class="row row-cols-1 row-cols-sm-auto g-4">
		{#each users as user}
		<UserCard {...user} />
		{/each}
	</div>
{:catch error}
	<p>Error: {error.message}</p>
{/await}
