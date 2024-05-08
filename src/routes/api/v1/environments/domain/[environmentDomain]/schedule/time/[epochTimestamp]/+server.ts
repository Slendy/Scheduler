import { EnvironmentModel } from '$lib/server/models.js';
import { dayjs } from '$lib/shared/dayjs';
import { getActiveSchedule } from '$lib/shared/schedule.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { environmentDomain, epochTimestamp } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    if (!environment) return error(404, "Environment not found");

    let schedules = environment.toApiResponse().schedules;

    let activeSchedule = getActiveSchedule(schedules, dayjs.tz(dayjs(epochTimestamp), environment.timeZone), environment.timeZone) as any
    if (!activeSchedule) {
        return error(404, "No schedule found");
    }

    // strip out identifying fields
    const { createdAt, updatedAt, enabled, name, ...responseSchedule } = activeSchedule;

    // don't send empty fields
    if (responseSchedule.scheduleType === 'one-time') {
        delete responseSchedule.scheduleWeekdays;
    } else if (responseSchedule.scheduleType === 'repeating') {
        delete responseSchedule.scheduleDate;
    }

    return Response.json(responseSchedule);
}