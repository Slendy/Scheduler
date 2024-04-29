<script>
	import { goto } from '$app/navigation';
	import EnhancedForm from '$lib/components/EnhancedForm.svelte';
</script>

<h1>Login</h1>
<EnhancedForm
	action={'/api/v1/auth/login'}
	succeed={(response) => {
		goto(response.redirect, { invalidateAll: true });
	}}
	fail={(response) => {
		console.log(response);
	}}
>
	<input type="text" name="username" placeholder="Username" />
	<input type="password" name="password" placeholder="Password" />
	<button type="submit">Login</button>
</EnhancedForm>
