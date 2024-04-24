import type { Schedule } from "$lib/shared/types";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, params, parent }) => {
    const { scheduleId } = params;
    const { environment } = await parent();

    let schedule = environment.schedules.find((s: Schedule) => s.scheduleId == scheduleId);
    if (schedule == null) {
        return redirect(301, `/admin/environments/${environment._id}/`)
    }
    
    return { schedule };
};