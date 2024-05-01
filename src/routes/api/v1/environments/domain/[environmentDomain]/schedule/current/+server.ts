import { EnvironmentModel } from '$lib/server/models.js';
import { getActiveSchedule } from '$lib/shared/schedule.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { environmentDomain } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    if (!environment) return error(404, "Environment not found");

    let schedules = environment.toApiResponse().schedules;

    // strip out identifying fields
    const { createdAt, updatedAt, enabled, name, ...activeSchedule } = getActiveSchedule(schedules, new Date()) as any;

    // don't send empty fields
    if (activeSchedule.scheduleType === 'one-time') {
        delete activeSchedule.scheduleWeekdays;
    } else if (activeSchedule.scheduleType === 'repeating') {
        delete activeSchedule.scheduleDate;
    }
    
    return Response.json(activeSchedule);
}