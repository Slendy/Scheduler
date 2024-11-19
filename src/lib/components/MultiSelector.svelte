<script lang="ts">
	export let options: string[] = [];
	export let selected: string[] = [];

    export let label: string = "Select options";

	let display: boolean = false;

	function toggleOption(option: string) {
		if (selected.includes(option)) {
			selected = selected.filter((s) => s != option);
		} else {
			selected = [...selected, option];
			// this might not be the most efficient way to do this but it ensures
			// that options are always in the order they were provided
			selected = options.filter((o) => selected.includes(o));
		}
	}

	function handleFocusLoss(e: any) {
		console.log('focusout');
		console.log(e);
		let curElement = e.currentTarget;
		let relatedElement = e.relatedTarget;
		if (relatedElement && curElement.contains(relatedElement)) {
			return;
		}
		display = true;
	}
</script>

<div>
	<div class="btn-group">
		<button
			class="btn btn-secondary dropdown-toggle"
			type="button"
			data-bs-toggle="dropdown"
			data-bs-auto-close="outside"
			aria-expanded="false"
		>
			{label}
		</button>
		<ul class="dropdown-menu">
			{#each options as option}
				<li>
					<button
						type="button"
						class="dropdown-item"
						class:active={selected.includes(option)}
						on:click={() => toggleOption(option)}
					>
						{option}
					</button>
				</li>
			{/each}
			<!-- <li><button class="dropdown-item">Menu item</button></li>
			<li><button class="dropdown-item">Menu item</button></li>
			<li><button class="dropdown-item">Menu item</button></li> -->
		</ul>
	</div>
</div>

<!-- <div style="max-width: 300px;" on:focusout={(e) => handleFocusLoss(e)} tabindex="-1">
	<button class="btn btn-secondary" style="width: 100%" on:click={() => (display = !display)}
		>{selected.length == 0 ? 'Select option' : selected.join(', ')}</button
	>
	{#if display}
		<div class="d-relative">
			<div class="d-absolute">
				<ul class="list-group flex-shrink d-inline-flex w-100">
					{#each options as option}
						<button
							on:click={() => toggleOption(option)}
							class="list-group-item list-group-item-action"
							class:active={selected.includes(option)}>{option}</button
						>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</div> -->
