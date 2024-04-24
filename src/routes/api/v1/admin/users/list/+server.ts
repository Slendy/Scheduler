import { UserModel } from '$lib/server/models';
import { apiFormSuccess } from '$lib/server/utils.js';

export const GET = async ({ }) => {
    const users = await UserModel.find();

    return apiFormSuccess({ users })
}