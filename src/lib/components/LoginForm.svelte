<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../../routes/login/schema';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" use:enhance>
	<Card.Root class="mx-auto max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your username and password below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Form.Field {form} name="username" required>
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Username</Form.Label>
								<Input {...props} bind:value={$formData.username} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">

					<Form.Field class="w-full" {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center">
									<Form.Label>Password</Form.Label>
								</div>
								<Input {...props} type="password" bind:value={$formData.password} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					{#if message != null}
						<p>{message.text}</p>
						{/if}

				</div>
				<Form.Button>Login</Form.Button>
				<a href="##" class="mx-auto inline-block text-sm underline">
					Forgot your password?
				</a>
			</div>
			<div class="mt-4 text-center text-sm">
				Don't have an account?
				<a href="##" class="underline"> Sign up </a>
			</div>
		</Card.Content>
	</Card.Root>
</form>

<!--<form method="POST" use:enhance>-->
<!--	<Form.Field {form} name="username">-->
<!--		<Form.Control>-->
<!--			{#snippet children({ props })}-->
<!--				<Form.Label>Username</Form.Label>-->
<!--				<Input {...props} bind:value={$formData.username} />-->
<!--			{/snippet}-->
<!--		</Form.Control>-->
<!--		<Form.Description>This is your public display name.</Form.Description>-->
<!--		<Form.FieldErrors />-->
<!--	</Form.Field>-->
<!--	<Form.Button>Submit</Form.Button>-->
<!--</form>-->