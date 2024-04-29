import { EnvironmentModel } from '$lib/server/models';
import { apiResponse } from '$lib/server/utils';

export const GET = async ({ }) => {
    const environments = await EnvironmentModel.find();

    return apiResponse(200, { environments: environments.map(environment => environment.toApiResponse()) });
}