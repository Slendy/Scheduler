<script lang="ts">
    import { page } from '$app/stores';
	interface Props {
		items: { display: string; href: string }[];
	}

	let { items }: Props = $props();
</script>

{#each items as item}
	<a
		href={item.href}
		class="list-group-item list-group-item-action rounded-2 mb-1"
		class:active={$page.url.pathname == item.href}
	>
		{item.display}
	</a>
{/each}
