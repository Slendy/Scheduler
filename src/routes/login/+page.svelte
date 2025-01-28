<script lang="ts">
	// import { goto } from '$app/navigation';
	// import EnhancedForm from '$lib/components/EnhancedForm.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';

	let {data} = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm {data} />
</div>

<!--<EnhancedForm-->
<!--	action={'/api/v1/auth/login'}-->
<!--	succeed={async (response) => {-->
<!--		await goto(response.redirect, { invalidateAll: true });-->
<!--	}}-->
<!--	fail={(response) => {-->
<!--		console.log(response);-->
<!--	}}-->
<!--&gt;-->
<!--	<input type="text" name="username" placeholder="Username" />-->
<!--	<input type="password" name="password" placeholder="Password" />-->
<!--	<button type="submit">Login</button>-->
<!--</EnhancedForm>-->
