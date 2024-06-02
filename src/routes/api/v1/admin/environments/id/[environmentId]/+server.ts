import { validateEnvironmentId } from '$lib/server/validation';

export const GET = async ({ params }) => {
    const { environmentId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    return Response.json(environment.toApiResponse());
}