import { UserModel } from '$lib/server/models';
import { error } from '@sveltejs/kit';
import { isValidObjectId } from 'mongoose';

export const GET = async ({ params }) => {
    const { userId } = params;
    if (!isValidObjectId(userId)) {
        return error(400, "Invalid user ID");
    }
    const user = await UserModel.findOne({ _id: userId });
    if (user === null) {
        return error(404, "User not found");
    }
    return Response.json(user);
}