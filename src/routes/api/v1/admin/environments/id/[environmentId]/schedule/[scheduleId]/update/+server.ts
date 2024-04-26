import { EnvironmentModel } from '$lib/server/models';
import { apiFormError, apiFormErrorCustom, apiFormSuccess } from '$lib/server/utils.js';
import { isValidObjectId } from 'mongoose';
import type { Schedule } from '$lib/shared/types.js';
import { verifySchedule } from '$lib/shared/schedule.js';

export const POST = async ({ request, params }) => {
    const { environmentId, scheduleId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID');
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404);
    }

    const existingSchedule = environment.schedules.find(s => s.scheduleId == scheduleId);
    if (!existingSchedule) {
        return apiFormError("Schedule not found", 404);
    }

    const formData = await request.formData();

    const data = formData.get('data');

    if (!data) {
        return apiFormError('There was no data provided with the request');
    }

    let newSchedule: Schedule = JSON.parse(data.toString());

    if (newSchedule.scheduleId != existingSchedule.scheduleId) {
        return apiFormError("Schedule ID doesn't match");
    }

    let scheduleErrors: string[] = verifySchedule(newSchedule);
    if (scheduleErrors.length > 0) {
        return apiFormErrorCustom({ errors: scheduleErrors });
    }

    let scheduleIndex = environment.schedules.findIndex(s => s.scheduleId == existingSchedule.scheduleId);

    environment.schedules[scheduleIndex] = newSchedule;
    await environment.save();

    return apiFormSuccess();
}