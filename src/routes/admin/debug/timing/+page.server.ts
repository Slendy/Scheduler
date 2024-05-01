import { EnvironmentModel } from '$lib/server/models.js';
import { isValidObjectId } from 'mongoose';

export const load = async ({ url }) => {
    let environmentId = url.searchParams.get('environmentId');
    let scheduleId = url.searchParams.get('scheduleId');
    if (!isValidObjectId(environmentId)) {
        return { error: 'Environment ID is invalid' }
    }
    let environment = (await EnvironmentModel.findOne({ _id: environmentId })).toObject({ getters: true });
    if (environment == null) {
        return { error: 'Environment not found' }
    }
    let schedule = environment.schedules.find((s: any) => s.scheduleId == scheduleId);
    if (schedule == null) {
        schedule = environment.schedules[0];
    }

    return { environmentSerialized: JSON.stringify(environment), scheduleSerialized: JSON.stringify(schedule) }
}