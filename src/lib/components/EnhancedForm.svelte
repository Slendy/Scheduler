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
</script>

<form
	{method}
	{action}
	on:submit|preventDefault={(e) => onSubmit(e)}
	use:enhance={() => submitFunction()}
>
	<slot></slot>
</form>
