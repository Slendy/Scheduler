import { UserModel } from '$lib/server/models';
import { error } from '@sveltejs/kit';

export const GET = async ({ }) => {
    const users = await UserModel.find();
    return Response.json({ users });
}