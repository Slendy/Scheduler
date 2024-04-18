import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId, type ObjectId } from 'mongoose';
import isValidDomain from 'is-valid-domain';
import { apiResponse } from '$lib/server/utils.js';

export const POST = async ({ request }) => {
    const data = await request.formData();
    const name = data.get('envName');
    if (name == null || name.toString().length == 0) {
        return apiResponse(400, { success: false, message: 'Invalid environment name' })
    }
    const domain = data.get('envDomain');
    if (domain == null || domain.toString().length == 0 || !isValidDomain(domain.toString())) {
        return apiResponse(400, { success: false, message: 'Invalid environment domain' })
    }
    if (await EnvironmentModel.exists({ environmentDomain: domain })) {
        return apiResponse(400, { success: false, message: "An environment already exists with this domain" })
    }
    let newEnvironment = new EnvironmentModel({
        environmentName: name,
        environmentDomain: domain,
        schedules: [],
    })
    await newEnvironment.save();
    console.log(`Created new environment with name '${name}' and domain '${domain}'`)
    return apiResponse(200, { success: true, environment: newEnvironment })
}