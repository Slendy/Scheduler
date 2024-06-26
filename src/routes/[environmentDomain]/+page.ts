import { error } from "@sveltejs/kit";
import { hashObject } from "$lib/shared/hash.js";

export const load = async ({ params, fetch }) => {
    const { environmentDomain } = params;
    const response = await fetch(`/api/v1/environments/domain/${environmentDomain}/schedule/current`).then((res) => {
        if (!res.ok) return null;
        return res.json()
    }).catch(() => null);

    if (response == null) {
        throw error(404, "Environment not found");
    }

    return { schedule: response, scheduleHash: await hashObject(response) }
}