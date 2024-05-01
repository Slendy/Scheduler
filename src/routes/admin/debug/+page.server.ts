import { EnvironmentModel, UserModel } from '$lib/server/models';
export const load = async ({ }) => {
    const serializedUsers = JSON.stringify((await UserModel.find()).map(user => user.toObject()));
    const serializedEnvironments = JSON.stringify((await EnvironmentModel.find()).map(env => env.toObject()));

    return { serializedUsers, serializedEnvironments }
};