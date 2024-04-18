import type { LayoutLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ fetch, params }) => {
    const { environmentId } = params;
    let environment = await fetch('/api/v1/environments/id/' + environmentId)
        .then((response) => {
            if (!response.ok) {
                redirect(301, "/admin/environments");
            }
            return response.json();
        })
    return { environment };
};