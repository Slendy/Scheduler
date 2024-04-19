import { UserModel } from '$lib/server/models';
import { isValidObjectId, type ObjectId } from 'mongoose';
import { apiResponse } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export const POST = async ({ params, request }) => {
    const { userId } = params;
    if (!isValidObjectId(userId)) {
        return error(400, "Invalid user ID");
    }
    const user = await UserModel.findOne({ _id: userId });
    if (user === null) {
        return error(404, "User not found");
    }

    const data = await request.formData();
    const name = data.get('username');
    if (name == null || name.toString().length == 0) {
        return apiResponse(400, { success: false, message: 'Invalid username name' })
    }
    const password = data.get('password');
    if (await UserModel.exists({ username: name, _id: { $ne: user._id } })) {
        return apiResponse(400, { success: false, message: "A user already exists with this username" })
    }

    const isAdmin = data.get('isAdmin');

    user.username = name.toString();
    // html forms go brr and checkboxes are on/off and not true/false
    user.isAdmin = isAdmin?.toString() === "on";

    await user.save();

    console.log(`Updated user ${user._id} new name: '${name}', isAdmin: '${isAdmin}'`)
    return apiResponse(200, { success: true, user: user })
}