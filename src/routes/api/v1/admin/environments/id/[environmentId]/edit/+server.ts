import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import isValidDomain from 'is-valid-domain';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { isValidTimeZone } from '$lib/shared/timezones.js';

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID')
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404)
    }

    const data = await request.formData();
    const name = data.get('envName');
    if (name == null || name.toString().length == 0) {
        return apiFormError('Invalid environment name')
    }
    const domain = data.get('envDomain');
    if (domain == null || domain.toString().length == 0 || !isValidDomain(domain.toString())) {
        return apiFormError('Invalid environment domain')
    }
    const timeZone = data.get('envTimezone');
    if (timeZone == null || !isValidTimeZone(timeZone.toString())) {
        return apiFormError('Invalid environment timezone');
    }
    if (await EnvironmentModel.exists({ environmentDomain: domain, _id: { $ne: environment._id } })) {
        return apiFormError('An environment already exists with this domain')
    }
    environment.environmentName = name.toString();
    environment.environmentDomain = domain.toString();
    environment.timeZone = timeZone.toString();
    environment.isVerified = false;

    await environment.save();
    console.log(`Updated environment ${environment._id} new name: '${name}', new domain: '${domain}'`)
    return apiFormSuccess(environment.toApiResponse())
}