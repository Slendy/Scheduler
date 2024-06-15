import { TokenModel, UserModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';

export const POST = async ({ params }) => {
    const { userId } = params;
    if (!isValidObjectId(userId)) {
        return apiFormError('Invalid user ID')
    }
    const user = await UserModel.findOne({ _id: userId });
    if (user === null) {
        return apiFormError('User not found', 404)
    }

    await user.remove();

    console.log(`Deleted user ${user._id}`);
    return apiFormSuccess();
}