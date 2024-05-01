import { EnvironmentModel } from '$lib/server/models';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { isValidObjectId } from 'mongoose';

export const POST = async ({ request, params }) => {
    const { environmentId, scheduleId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID');
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404);
    }

    const existingSchedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
    if (!existingSchedule) {
        return apiFormError("Schedule not found", 404);
    }

    existingSchedule.enabled = !existingSchedule.enabled;

    await environment.save();

    return apiFormSuccess();
}