import { apiFormError, apiFormErrorCustom, apiFormSuccess } from '$lib/server/utils.js';
import type { Schedule } from '$lib/shared/types.js';
import { verifySchedule } from '$lib/shared/schedule.js';
import { validateEnvironmentId } from '$lib/server/validation';

export const POST = async ({ request, params }) => {
    const { environmentId, scheduleId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    const existingSchedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
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

    // Create a copy of the existing schedule without it's history and timestamps
    let { history, createdAt, updatedAt, enabled, ...historySchedule } = existingSchedule.toObject() as any;

    existingSchedule.name = newSchedule.name;
    (existingSchedule as any).events = newSchedule.events;
    (existingSchedule as any).variations = newSchedule.variations;
    existingSchedule.scheduleType = newSchedule.scheduleType;
    if (existingSchedule.scheduleType == 'one-time') {
        existingSchedule.scheduleDate = newSchedule.scheduleDate!;
        // we have to cast to any to set a non required field to undefined
        (existingSchedule as any).scheduleWeekdays = undefined;
    } else if (existingSchedule.scheduleType == 'repeating') {
        existingSchedule.scheduleWeekdays = newSchedule.scheduleWeekdays!;
        (existingSchedule as any).scheduleDate = undefined;
    }

    let time = new Date().toISOString();

    // Store copy of schedule in history and truncate list at 10 entries, removing the oldest entries first.
    let newHistoryList = (existingSchedule as any).history || [];
    let itemsToRemove = Math.min(newHistoryList.length - 10, 0);
    newHistoryList = newHistoryList.slice(itemsToRemove);
    newHistoryList.push({ time, schedule: historySchedule });

    // Add that to the history of the existing schedule
    (existingSchedule as any).history = newHistoryList;

    await environment.save();

    return apiFormSuccess();
}