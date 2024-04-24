import { UserModel } from '$lib/server/models';
import { apiFormSuccess } from '$lib/server/utils.js';

export const GET = async ({ }) => {
    const totalUsers = await UserModel.estimatedDocumentCount();

    return apiFormSuccess({ totalUsers })
}