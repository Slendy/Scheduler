import { EnvironmentModel } from "$lib/server/models";
import { error } from "@sveltejs/kit";

export const GET = async ({ params }) => {
    let { environmentDomain } = params;

    let environment = await EnvironmentModel.findOne({ domain: environmentDomain });
    if(environment == null || !environment.icon) throw error(404);

    return new Response(environment.icon, {
        headers: {
            'Content-Type': 'image/x-icon',
        }
    })
}