<script lang="ts">
	import { enhance } from '$app/forms';

	//NOTE(josh): maybe typescript wasn't the best idea

	const submitFunction = () => {
		return async ({ result }: { result: any }) => {
			if (result.success) {
				succeed(result);
			} else {
				fail(result);
			}
		};
	};

	export let method = 'post';
	export let action = '';
	export let fail: (result: any) => any = () => {};
	export let succeed: (result: any) => any;
	export let onSubmit: (e: Event) => any = () => {};
	export let onKeydown: (e: any) => any = () => {};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form
	{method}
	{action}
	on:keydown={(e) => onKeydown(e)}
	on:submit|preventDefault={(e) => onSubmit(e)}
	
	use:enhance={() => submitFunction()}
>
	<slot></slot>
</form>
