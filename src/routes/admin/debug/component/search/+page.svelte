<script lang="ts">
	import UserSearch from '$lib/components/UserSearch.svelte';

	let selectedUser: any | undefined;
</script>

<h1>Search tester</h1>

<p>User id: {selectedUser?._id ?? 'undefined'}</p>

<UserSearch bind:selectedUser />
