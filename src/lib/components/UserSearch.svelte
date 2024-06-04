<script lang="ts">
	import { onMount } from "svelte";

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

	onMount(() => {
		// this looks redundant but ResizeObserver handles most zooming scenarios
		// and resize handles any edge cases
		let observer = new ResizeObserver(() => {
			onResize();
		});
		window.addEventListener('resize', onResize);
		onResize();
		observer.observe(input);

		return () => {
			window.removeEventListener('resize', onResize);
			observer.disconnect();
		}
	})

	function onResize(){
		inputBoundingRect = input.getBoundingClientRect();
		scrollY = window.scrollY;
		console.log(inputBoundingRect);
	}

	let input: any;
	let inputBoundingRect: any;
	let scrollY: any;
</script>

<div>
	<div bind:this={input}>
		<input
			type="text"
			class="form-control"
			placeholder="Username"
			bind:value={inputValue}
			on:keyup={(e) => {
				if (inputValue == previousInput) return;

				previousInput = inputValue;
				loadAutocomplete(inputValue);
			}}
		/>
	</div>

	{#if !hideResults}
		<div
			class="position-absolute"
			style="width: {inputBoundingRect?.width}px; top: {inputBoundingRect?.bottom + (scrollY || 0)}px; left: {inputBoundingRect?.left}px; z-index: 99"
		>
			<div class="list-group list-group-item-dark rounded-0 rounded-bottom" style="max-height: 10rem; overflow-y: auto;">
				{#if !fetchTask && inputValue?.length > 0 && results.length == 0}
					<li class="list-group-item">No results</li>
				{:else if fetchTask}
					<li class="list-group-item">Loading...</li>
				{:else}
					{#each results as result}
						<button
							class="list-group-item list-group-item-action"
							on:click={() => selectUser(result)}
						>
							{result.username}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
