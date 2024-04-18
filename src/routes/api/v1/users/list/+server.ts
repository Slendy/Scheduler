import { UserModel } from '$lib/server/models';
import { apiResponse } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ }) => {
    const users = await UserModel.find();
    return apiResponse(200, { users });
}