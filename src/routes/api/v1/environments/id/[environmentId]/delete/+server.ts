import { EnvironmentModel } from '$lib/server/models';
import { isValidObjectId, type ObjectId } from 'mongoose';
import { error } from '@sveltejs/kit';
import { apiResponse } from '$lib/server/utils.js';

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
    const name = data.get('confirmName');
    if (name == null) {
        return apiResponse(400, { success: false, message: 'Invalid environment name' })
    }
    if (name != environment.environmentName) {
        return apiResponse(400, { success: false, message: "Environment name doesn't match" })
    }
    await environment.deleteOne();
    console.log(`Deleted environment '${environment._id}'`)
    return apiResponse(200, { success: true });
}