import { generateToken, setCookieToken } from '$lib/server/auth.js';
import { UserModel } from '$lib/server/models.js';
import { apiFormError } from '$lib/server/utils.js';
import * as argon2 from 'argon2';

export const POST = async ({ request, cookies }) => {
    const data = await request.formData();
    //TODO give out refresh token and auth token cookies (preferrably jwt so we don't have to store them in db)
    //TODO add toggleable instance settings that will be stored in db but will have defaults if they don't exist for some reason
    // each setting in DB should store it's value, the last user to edit it, and the last time it was edited (similar to cloudflare)

    const username = data.get('username');
    const password = data.get('password');
    if (!username || !password) {
        return apiFormError('Username and password are required');
    }

    let user = await UserModel.findOne({ username: username });
    if (!user) {
        return apiFormError('Invalid username or password');
    }

    if (!await argon2.verify(password.toString(), user.passwordHash)) {
        return apiFormError('Invalid username or password');
    }

    let token = await generateToken(user);
    if (token == undefined) {
        return apiFormError('Failed to generate token');
    }

    setCookieToken(cookies, token);

    return Response.json({ success: true, redirect: user.isAdmin ? '/admin' : '' });
}