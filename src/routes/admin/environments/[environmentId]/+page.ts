import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
    const { environmentId } = params;
    let environment = await fetch('http://localhost:5001/api/v1/environment/id/' + environmentId)
        .then((response) => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        })
    if (environment != null) {
        return {
            environment: environment
        };
    }
    redirect(301, "/admin/environments");
};