import { EnvironmentModel } from '$lib/server/models';
import { error } from '@sveltejs/kit';
import { isValidObjectId } from 'mongoose';

export const GET = async ({ params }) => {
    const { environmentId } = params;
    if (!isValidObjectId(environmentId)) {
        return error(400, "Invalid environment ID");
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return error(404, "Environment not found");
    }

    let responseEnvironment: any = environment.toObject({getters: true});

    responseEnvironment.schedules = responseEnvironment.schedules.map(({ history, ...rest }: any) => rest);

    return Response.json(responseEnvironment);
}