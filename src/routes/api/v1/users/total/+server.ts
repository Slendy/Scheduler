import { UserModel } from '$lib/server/models';

export const GET = async ({ }) => {
    const totalUsers = await UserModel.estimatedDocumentCount();
    return Response.json({ totalUsers });
}