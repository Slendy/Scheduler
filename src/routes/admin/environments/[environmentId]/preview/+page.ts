import { error } from "@sveltejs/kit";
import { hashObject } from "$lib/shared/hash.js";

export const load = async ({ parent, fetch }) => {
    let { environment } = await parent();

    const response = await fetch(`/api/v1/environments/domain/${environment.environmentDomain}/schedule/current`);

    // If there are no schedules don't trigger the error page
    if (response.status == 404) {
        return { schedule: undefined, scheduleHash: undefined }
    }

    if (!response.ok) {
        throw error(400, "Invalid environment");
    }

    let scheduleResponse = await response.json();

    return { schedule: scheduleResponse, scheduleHash: await hashObject(scheduleResponse) }
}