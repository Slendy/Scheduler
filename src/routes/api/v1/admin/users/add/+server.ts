import { TokenModel, UserModel } from '$lib/server/models';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import * as argon2 from 'argon2';

export const POST = async ({ params, request }) => {
    const data = await request.formData();
    const name = data.get('username');
    if (name == null || name.toString().length == 0) {
        return apiFormError('Invalid username')
    }
    const password = data.get('password');
    if (await UserModel.exists({ username: name })) {
        return apiFormError('A user already exists with this username')
    }

    if (!password || password.toString().length == 0) {
        return apiFormError("Password cannot be empty")
    }

    let user = await UserModel.create({
        isAdmin: data.get('isAdmin')?.toString() === "on",
        username: name.toString(),
        passwordHash: await argon2.hash(password.toString()),
    });

    console.log(`Created user ${user._id} new name: '${name}', isAdmin: '${user.isAdmin}'`)
    return apiFormSuccess({ user })
}