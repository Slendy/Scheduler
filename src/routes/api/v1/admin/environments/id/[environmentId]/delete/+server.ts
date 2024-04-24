import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId } from 'mongoose';
import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    if (!isValidObjectId(environmentId)) {
        return apiFormError('Invalid environment ID');
    }
    const environment = await EnvironmentModel.findOne({ _id: environmentId });
    if (environment === null) {
        return apiFormError('Environment not found', 404)
    }
    const data = await request.formData();
    const name = data.get('confirmName');
    if (name == null) {
        return apiFormError('Invalid environment name')
    }
    if (name != environment.environmentName) {
        return apiFormError("Environment name doesn't match")
    }
    await environment.deleteOne();
    console.log(`Deleted environment '${environment._id}'`)
    return apiFormSuccess();
}