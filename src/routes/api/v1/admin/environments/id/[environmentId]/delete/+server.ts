import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { validateEnvironmentId } from '$lib/server/validation';

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

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