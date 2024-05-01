import { TokenModel, UserModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';

export const POST = async ({ params, request }) => {
    const { userId } = params;
    if (!isValidObjectId(userId)) {
        return apiFormError('Invalid user ID')
    }
    const user = await UserModel.findOne({ _id: userId });
    if (user === null) {
        return apiFormError('User not found', 404)
    }

    const data = await request.formData();
    const name = data.get('username');
    if (name == null || name.toString().length == 0) {
        return apiFormError('Invalid username')
    }
    const password = data.get('password');
    if (await UserModel.exists({ username: name, _id: { $ne: user._id } })) {
        return apiFormError('A user already exists with this username')
    }

    if (password != null && password.toString().length > 0) {
        user.passwordHash = await Bun.password.hash(password.toString());

        // if we change a user's password then invalidate all of their auth tokens
        TokenModel.deleteMany({ user: user._id }).exec();
    }

    const isAdmin = data.get('isAdmin');

    user.username = name.toString();
    // html forms go brr and checkboxes are on/off and not true/false
    user.isAdmin = isAdmin?.toString() === "on";

    await user.save();

    console.log(`Updated user ${user._id} new name: '${name}', isAdmin: '${isAdmin}'`)
    return apiFormSuccess({ user })
}