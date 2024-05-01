import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';

export const POST = async ({ params }) => {
    const { environmentId, scheduleId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID');
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404)
    }
    let schedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
    if (schedule == null) {
        return apiFormError('Schedule not found', 404);
    }

    environment.schedules = environment.schedules.filter((s: any) => s.scheduleId != schedule.scheduleId);
    await environment.save();
    
    console.log(`Deleted schedule '${scheduleId}'`)
    return apiFormSuccess();
}