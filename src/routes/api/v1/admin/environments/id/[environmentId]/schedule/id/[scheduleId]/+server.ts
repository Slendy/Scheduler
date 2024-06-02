import { validateEnvironmentId } from "$lib/server/validation";
import { error as errorResponse } from "@sveltejs/kit";

export const GET = async ({ params }) => {
    const { environmentId, scheduleId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    let schedule = environment.schedules.find((schedule: any) => schedule.scheduleId?.toString() == scheduleId);
    if (schedule == null) {
        return errorResponse(404, "Schedule not found");
    }

    return Response.json(schedule.toObject());
}