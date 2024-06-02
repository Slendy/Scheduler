import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { validateEnvironmentId } from '$lib/server/validation';

export const POST = async ({ request, params }) => {
    const { environmentId, scheduleId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    const existingSchedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
    if (!existingSchedule) {
        return apiFormError("Schedule not found", 404);
    }

    existingSchedule.enabled = !existingSchedule.enabled;

    await environment.save();

    return apiFormSuccess();
}