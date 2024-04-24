import { UserModel, EnvironmentModel } from '$lib/server/models';
import { apiResponse } from '$lib/server/utils.js';

export const GET = async ({ }) => {
    const totalUsers = await UserModel.estimatedDocumentCount();
    const totalEnvironments = await EnvironmentModel.estimatedDocumentCount();
    
    return apiResponse(200, { totalUsers, totalEnvironments });
}