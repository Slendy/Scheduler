import { dev } from '$app/environment'
import { EnvironmentModel, UserModel } from '$lib/server/models';
import { redirect } from '@sveltejs/kit';
export const load = async ({ }) => {
    if (!dev) {
        redirect(301, "/admin")
    }
    const serializedUsers = JSON.stringify((await UserModel.find()).map(user => user.toObject()));
    const serializedEnvironments = JSON.stringify((await EnvironmentModel.find()).map(env => env.toObject()));

    return { serializedUsers, serializedEnvironments }
};