import { apiFormError, apiFormSuccess } from '$lib/server/utils.js';
import { validateEnvironmentId } from '$lib/server/validation.js';
import type { EnvironmentPermissions } from '$lib/shared/permissions.js';

export const POST = async ({ params, request }) => {
    let { environmentId } = params;

    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    let formData = await request.formData();
    let userId = formData.get('userId')?.toString();
    if (!userId) {
        return apiFormError("You must specify a user");
    }

    if (environment.environmentOwner?.toString() == userId) {
        return apiFormError("You cannot add the owner of the environment as a collaborator");
    }

    let permissions = formData.get('permissions')?.toString();
    if (!permissions) {
        return apiFormError("You must specify permissions");
    }

    let permissionBitmask = parseInt(permissions) as EnvironmentPermissions;

    environment.environmentCollaborators.push({ userId, permissions: permissionBitmask });
    await environment.save();

    return apiFormSuccess();
}