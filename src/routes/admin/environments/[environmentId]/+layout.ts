import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, params }) => {
    const { environmentId } = params;
    let environment = await fetch('/api/v1/admin/environments/id/' + environmentId)
        .then((response) => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        })
    if (environment == null) {
        return redirect(301, "/admin/environments");
    }
    return { environment };
};