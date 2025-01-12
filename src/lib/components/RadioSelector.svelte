<script lang="ts">

	interface Props {
		options: {id: string, label: string}[];
		name: string;
		value: any;
	}

	let { options, name, value = $bindable() }: Props = $props();
</script>

{#if options.length > 0}
<div class="btn-group" role="group" aria-label="Radio toggle button group">
		{#each options as option}
			<input
				type="radio"
				class="btn-check"
				id="{option.id}"
				value="{option.id}"
                name={name}
				autocomplete="off"
				bind:group={value}
			/>
			<label class="btn btn-outline-secondary" for="{option.id}">{option.label}</label>
		{/each}
	</div>
{/if}
