import { EnvironmentModel } from '$lib/server/models.js';
import { dayjs } from '$lib/shared/dayjs';
import { hashObject } from '$lib/shared/hash';
import { getActiveSchedule } from '$lib/shared/schedule.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { environmentDomain, epochTimestamp } = params;

    let environment = await EnvironmentModel.findOne({ environmentDomain });
    if (!environment) return error(404, "Environment not found");

    let parsedTimestamp = parseInt(epochTimestamp);
    if(isNaN(parsedTimestamp) || parsedTimestamp == 0){
        return error(400, "Timestamp is invalid");
    }

    let schedules = environment.toApiResponse().schedules;

    let activeSchedule = getActiveSchedule(schedules, dayjs.tz(dayjs(parsedTimestamp), environment.timeZone), environment.timeZone) as any
    if (!activeSchedule) {
        return error(404, "No schedule found");
    }

    // strip out identifying fields
    const { createdAt, updatedAt, enabled, name, scheduleType, scheduleWeekdays, scheduleDate, ...responseSchedule } = activeSchedule.schedule;

    responseSchedule.scheduleDate = activeSchedule.scheduleDate.toDate();

    return Response.json(responseSchedule, {
        headers: {
            "ETag": await hashObject(responseSchedule),
        }
    });
}