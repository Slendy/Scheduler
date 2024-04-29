import { EnvironmentModel } from '$lib/server/models';
import { apiResponse } from '$lib/server/utils';

export const GET = async ({ }) => {
    const environments = await EnvironmentModel.find();

    let environmentsResponse = environments.map(env => env.toApiResponse())
        .map(env => ({ ...env, totalSchedules: env.schedules.length }))
        .map(({ schedules, ...rest }) => rest);

    return apiResponse(200, { environments: environmentsResponse });
}