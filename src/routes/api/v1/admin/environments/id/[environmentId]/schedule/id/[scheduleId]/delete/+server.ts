import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { validateEnvironmentId } from '$lib/server/validation';

export const POST = async ({ params }) => {
    const { environmentId, scheduleId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    let schedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
    if (schedule == null) {
        return apiFormError('Schedule not found', 404);
    }

    (environment as any).schedules = environment.schedules.filter((s: any) => s.scheduleId != schedule.scheduleId);
    await environment.save();
    
    console.log(`Deleted schedule '${scheduleId}'`)
    return apiFormSuccess();
}