<script>
	let counter = 0;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={() => (counter += 1)}>Increment counter</button>
<p>Counter: {counter}</p>

<a href="/login">Log in</a>
<a href="/admin">Admin link</a>
