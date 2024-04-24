import { EnvironmentModel } from '$lib/server/models';
import isValidDomain from 'is-valid-domain';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';

export const POST = async ({ request }) => {
    const data = await request.formData();
    const name = data.get('envName');
    if (name == null || name.toString().length == 0) {
        return apiFormError('Invalid environment name')
    }
    const domain = data.get('envDomain');
    if (domain == null || domain.toString().length == 0 || !isValidDomain(domain.toString())) {
        return apiFormError('Invalid environment domain')
    }
    if (await EnvironmentModel.exists({ environmentDomain: domain })) {
        return apiFormError("An environment already exists with this domain")
    }
    let newEnvironment = new EnvironmentModel({
        environmentName: name,
        environmentDomain: domain,
        isVerified: false,
        schedules: [],
    })
    await newEnvironment.save();
    console.log(`Created new environment with name '${name}' and domain '${domain}'`)
    return apiFormSuccess({ environment: newEnvironment })
}