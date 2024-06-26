<script lang="ts">
	import { slide } from 'svelte/transition';
	import EditableSpan from './EditableSpan.svelte';
	import { MAX_VARIATION_NAME_LEN, MAX_VARIATION_OPTION_LEN } from '$lib/shared/schedule';
	export let title: string = '';
	type Option = {
		id: string;
		name: string;
	};
	export let options: string[] = [];

	export let generateRandomId: () => string;

	export let deleteCallback: () => {};

	// initially set internalOptions otherwise it will be immediately cleared out by the reactive statement below
	let internalOptions: Option[] = options.map(o => ({ name: o, id: generateRandomId() }));

	// update options any time internalOptions changes
	$: options = internalOptions.map((o) => o.name);

	let placeholderValue = '';

	function deleteVariation(variation: Option) {
		internalOptions = internalOptions.filter((o) => o.id != variation.id);
	}
</script>

<div class="col variation-block" id="variation-template" transition:slide>
	<div class="card mt-3 text-center mx-auto" style="width: 14rem">
		<div class="card-header py-0">
			<EditableSpan
				extraClasses={'card-text mt-1'}
				placeholder={'Variation name'}
				maxLength={MAX_VARIATION_NAME_LEN}
				bind:value={title}
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<i
				class="bi bi-trash position-absolute text-danger end-0 top-0 pe-3 pt-1 clickable"
				on:click={deleteCallback}
			>
			</i>
		</div>
		<div class="card-body p-1 variation-item-container">
			{#each internalOptions as option}
				<div class="row variation-item-block" transition:slide>
					<div class="col"></div>
					<div class="col-auto">
						<EditableSpan
							extraClasses={'card-text mt-1'}
							placeholder={'Variation'}
							maxLength={MAX_VARIATION_OPTION_LEN}
							bind:value={option.name}
						/>
					</div>
					<div class="col">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<i
							class="bi bi-x d-inline position-static text-secondary fs-3 clickable"
							on:click={() => deleteVariation(option)}
						></i>
					</div>
				</div>
			{/each}
			<EditableSpan
				extraClasses={'card-text mt-1'}
				placeholder={'New variation'}
				bind:value={placeholderValue}
				on:onsave={(event) => {
					internalOptions = [
						...internalOptions,
						{ name: event.detail.value, id: generateRandomId() }
					];
					placeholderValue = '';
				}}
			/>
		</div>
	</div>
</div>
