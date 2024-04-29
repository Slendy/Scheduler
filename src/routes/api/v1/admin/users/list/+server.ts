import { UserModel } from '$lib/server/models';

export const GET = async ({ }) => {
    const users = await UserModel.find();

    return Response.json({ users: users.map(user => user.toApiResponse()) });
}