<script lang="ts">
	import { enhance } from '$app/forms';

	//NOTE(josh): maybe typescript wasn't the best idea

	const submitFunction = () => {
		return async ({ result }: { result: any }) => {
			if (result.success) {
				await succeed(result);
			} else {
				await fail(result);
			}
			submitting = false;
		};
	};

	interface Props {
		method?: 'post' | 'dialog' | 'get' | 'DIALOG' | 'GET' | 'POST' | null | undefined;
		action?: string;
		submitting?: boolean;
		encType?:
			| 'application/x-www-form-urlencoded'
			| 'multipart/form-data'
			| 'text/plain'
			| null
			| undefined;
		fail?: (result: any) => any;
		succeed: (result: any) => any;
		onSubmit?: (e: Event) => any;
		onKeydown?: (e: any) => any;
		children?: import('svelte').Snippet;
	}

	let {
		method = 'post',
		action = '',
		submitting = $bindable(false),
		encType = 'application/x-www-form-urlencoded',
		fail = () => {},
		succeed,
		onSubmit = () => {},
		onKeydown = () => {},
		children
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<form
	{method}
	{action}
	enctype={encType}
	onkeydown={(e) => onKeydown(e)}
	onsubmit={(e) => {
		if (submitting) {
			e.preventDefault();
			e.stopImmediatePropagation();
			return;
		}

		onSubmit(e);

		if (!e.defaultPrevented) {
			submitting = true;
		}
	}}
	use:enhance={() => submitFunction()}
>
	{@render children?.()}
</form>
