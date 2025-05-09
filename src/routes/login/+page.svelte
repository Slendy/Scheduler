<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';

	let { data } = $props();
</script>

<div class="flex h-dvh w-full items-center justify-center px-4">
	<LoginForm {data} />
</div>
