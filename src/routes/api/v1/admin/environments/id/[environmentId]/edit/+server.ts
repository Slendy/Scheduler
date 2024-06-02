import { EnvironmentModel } from '$lib/server/models';
import isValidDomain from 'is-valid-domain';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { isValidTimeZone } from '$lib/shared/timezones.js';
import { validateEnvironmentId } from '$lib/server/validation';

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    const data = await request.formData();
    const name = data.get('envName');
    if (name == null || name.toString().length == 0) {
        return apiFormError('Invalid environment name')
    }

    const domain = data.get('envDomain');
    if (domain == null || domain.toString().length == 0 || !isValidDomain(domain.toString())) {
        return apiFormError('Invalid environment domain')
    }

    const timeZone = data.get('envTimeZone');
    if (timeZone == null || !isValidTimeZone(timeZone.toString())) {
        return apiFormError('Invalid environment time zone');
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