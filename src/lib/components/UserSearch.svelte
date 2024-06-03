<script lang="ts">
	let inputValue: string;

	export let selectedUser: any | undefined;

	let fetchTask: Promise<any> | undefined;

	let results: any[] = [];
	let hideResults = false;
	async function loadAutocomplete(input: string) {
		if (input.length == 0) {
			hideResults = true;
			return;
		}
		// if we are already searching then don't initiate another search
		if (fetchTask) {
			return;
		}

		selectedUser = undefined;
		fetchTask = fetch('/api/v1/admin/users/search?value=' + input)
			.then(async (response) => {
				let userList = await response.json();
				console.log(userList);
				results = userList.users;
				hideResults = false;
			})
			.finally(() => {
				// try and rate limit searches
				setTimeout(() => {
					fetchTask = undefined;
					if (inputValue != input) {
						loadAutocomplete(inputValue);
					}
				}, 250);
			});
	}

	function selectUser(user: any) {
		inputValue = user.username;
		selectedUser = user;
		hideResults = true;
	}
</script>

<div>
	<div>
		<input
			type="text"
			class="form-control"
			placeholder="Username"
			bind:value={inputValue}
			on:keyup={() => loadAutocomplete(inputValue)}
		/>
	</div>

	<div class="list-group list-group-item-dark">
		{#if !hideResults && inputValue?.length > 0 && results.length == 0}
			<li class="list-group-item">No results</li>
		{:else if !hideResults}
			{#each results as result}
				<button class="list-group-item list-group-item-action" on:click={() => selectUser(result)}>
					{result.username}
				</button>
			{/each}
		{/if}
	</div>
</div>
