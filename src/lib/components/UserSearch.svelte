<script lang="ts">
	let inputValue: string;
	let previousInput: string;

	export let selectedUser: any | undefined;

	let fetchTask: Promise<any> | undefined;

	let results: any[] = [];
	let hideResults = false;
	async function loadAutocomplete(input: string) {
		if (input.length == 0) {
			hideResults = true;
			selectedUser = undefined;
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
			on:focus={() => {
				if (!selectedUser) {
					hideResults = false;
				}
			}}
			on:blur={() => {
				hideResults = true;
			}}
			on:keyup={(e) => {
				if (inputValue == previousInput) return;

				previousInput = inputValue;
				loadAutocomplete(inputValue);
			}}
		/>
	</div>

	{#if !hideResults}
		<div class="position-relative">
			<div class="position-absolute" style="width: 100%">
				<div
					class="list-group list-group-item-dark rounded-0 rounded-bottom"
					style="max-height: 10rem; overflow-y: auto;"
				>
					{#if !fetchTask && inputValue?.length > 0 && results.length == 0}
						<li class="list-group-item">No results</li>
					{:else if fetchTask}
						<li class="list-group-item">Loading...</li>
					{:else}
						{#each results as result}
							<button
								class="list-group-item list-group-item-action"
								on:mousedown={() => selectUser(result)}
							>
								{result.username}
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
