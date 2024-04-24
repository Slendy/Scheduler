import { EnvironmentModel } from '$lib/server/models.js';
import { apiResponse } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { environmentDomain } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    console.log(environment);
    if (!environment) return error(404, "Environment not found");

    let schedules = environment.schedules;
    return Response.json({ schedules });
}