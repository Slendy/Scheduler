import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import isValidDomain from 'is-valid-domain';
import { apiResponse } from '$lib/server/utils.js';
import { error } from '@sveltejs/kit';

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    if (!isValidObjectId(environmentId)) {
        return error(400, "Invalid environment ID");
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return error(404, "Environment not found");
    }

    const data = await request.formData();
    const name = data.get('envName');
    if (name == null || name.toString().length == 0) {
        return apiResponse(400, { success: false, message: 'Invalid environment name' })
    }
    const domain = data.get('envDomain');
    if (domain == null || domain.toString().length == 0 || !isValidDomain(domain.toString())) {
        return apiResponse(400, { success: false, message: 'Invalid environment domain' })
    }
    if (await EnvironmentModel.exists({ environmentDomain: domain, _id: { $ne: environment._id } })) {
        return apiResponse(400, { success: false, message: "An environment already exists with this domain" })
    }
    environment.environmentName = name.toString();
    environment.environmentDomain = domain.toString();
    environment.isVerified = false;

    await environment.save();
    console.log(`Updated environment ${environment._id} new name: '${name}', new domain: '${domain}'`)
    return apiResponse(200, { success: true, environment })
}