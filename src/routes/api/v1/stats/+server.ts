import { UserModel, EnvironmentModel } from '$lib/server/models';

export const GET = async ({ }) => {
    const totalUsers = await UserModel.estimatedDocumentCount();
    const totalEnvironments = await EnvironmentModel.estimatedDocumentCount();
    return Response.json({ totalUsers, totalEnvironments });
}