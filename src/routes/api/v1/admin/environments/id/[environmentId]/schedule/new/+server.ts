import { EnvironmentModel } from '$lib/server/models';
import { apiFormError, apiFormErrorCustom, apiFormSuccess } from '$lib/server/utils.js';
import { isValidObjectId } from 'mongoose';
import type { Schedule } from '$lib/shared/types.js';
import { mongo } from 'mongoose';
import { verifySchedule } from '$lib/shared/schedule.js';

export const POST = async ({ request, params }) => {
    const { environmentId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID');
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404);
    }

    const formData = await request.formData();

    const data = formData.get('data');

    if (data == null) {
        return apiFormError('There was no data provided with the request');
    }

    let schedule: Schedule = JSON.parse(data.toString());

    let scheduleErrors: string[] = verifySchedule(schedule);
    if (scheduleErrors.length > 0) {
        return apiFormErrorCustom({ errors: scheduleErrors })
    }

    let newSchedule: Schedule = {
        scheduleId: new mongo.ObjectId().toString(),
        name: schedule.name,
        scheduleDate: schedule.scheduleDate,
        scheduleWeekdays: schedule.scheduleWeekdays,
        scheduleType: schedule.scheduleType,
        variations: schedule.variations,
        events: schedule.events,
    };

    environment.schedules.push(newSchedule);
    await environment.save();

    return apiFormSuccess();
}