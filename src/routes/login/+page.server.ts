import { message, setError, superValidate } from 'sveltekit-superforms';
import { loginSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { UserModel } from '$lib/server/models.js';
import { generateToken, setCookieToken } from '$lib/server/auth';

export const load = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		let user = await UserModel.findOne({ username: form.data.username });
		if (!user) {
			setError(form, 'username', 'Invalid username or password');
			return setError(form, 'password', 'Invalid username or password');
		}

		if (!await Bun.password.verify(form.data.password.toString(), user.passwordHash as Bun.StringOrBuffer)) {
			setError(form, 'username', 'Invalid username or password');
			return setError(form, 'password', 'Invalid username or password');
		}

		let token = await generateToken(user);
		if (token == undefined) {
			return message(form, 'Failed to generate token', { status: 400 });
		}

		setCookieToken(event.cookies, token);

		return redirect(301, user.isAdmin ? '/admin' : '/dashboard');
	}
};