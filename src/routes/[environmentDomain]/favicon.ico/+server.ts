import { EnvironmentModel } from "$lib/server/models";
import { error } from "@sveltejs/kit";

export const GET = async ({ params }) => {
    let { environmentDomain } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    if(environment == null || !environment.environmentIcon) throw error(404);

    return new Response(environment.environmentIcon, {
        headers: {
            'Content-Type': 'image/x-icon',
        }
    })
}