import { EnvironmentModel } from '$lib/server/models.js';
import { dayjs } from '$lib/shared/dayjs';
import { hashObject } from '$lib/shared/hash.js';
import { getActiveSchedule } from '$lib/shared/schedule.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { environmentDomain } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    if (!environment) return error(400, "Invalid environment");

    let schedules = environment.toApiResponse().schedules;

    let activeSchedule = getActiveSchedule(schedules, dayjs.tz(dayjs(), environment.timeZone), environment.timeZone) as any
    if (!activeSchedule) {
        return error(404, "No schedule found");
    }

    // strip out identifying fields
    const { createdAt, updatedAt, enabled, name, scheduleType, scheduleWeekdays, scheduleDate, ...responseSchedule } = activeSchedule.schedule;

    responseSchedule.scheduleDate = activeSchedule.scheduleDate.toDate();
    responseSchedule.scheduleTimeZone = environment.timeZone;


    return Response.json(responseSchedule, {
        headers: {
            "ETag": await hashObject(responseSchedule),
        }
    });
}