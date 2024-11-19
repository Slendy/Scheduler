import { UserModel } from '$lib/server/models';

export const GET = async ({ url }) => {
    let searchValue = url.searchParams.get('value');
    const users = await UserModel.find({username: {$regex: "^" + searchValue, $options: "i"}});

    return Response.json({ users: users.map(user => user.toApiResponse()) });
}