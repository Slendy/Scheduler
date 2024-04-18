import { EnvironmentModel } from '$lib/server/models';
import { error } from '@sveltejs/kit';

export const GET = async ({ }) => {
    const environments = await EnvironmentModel.find();
    return Response.json({ environments });
}