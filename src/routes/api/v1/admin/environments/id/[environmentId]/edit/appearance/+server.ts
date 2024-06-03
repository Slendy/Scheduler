import { EnvironmentModel } from "$lib/server/models";
import { apiFormError, apiFormSuccess } from "$lib/server/utils";
import { validateEnvironmentId } from "$lib/server/validation.js";
import { isValidObjectId } from "mongoose";

export const POST = async ({ params, request }) => {
    const { environmentId } = params;
    let [environment, error] = await validateEnvironmentId(environmentId);
    if (!environment) return error!;

    const data = await request.formData();

    console.log("form data:", data);
    let envIcon = data.get('envIcon');
    let iconBlob = envIcon?.valueOf() as Blob;
    if (iconBlob != null && iconBlob.size > 0) {
        let iconBuffer = Buffer.from(await iconBlob.arrayBuffer());
        
        //TODO re-encode image to resize to 128x128

        environment.environmentIcon = iconBuffer;
    }
    await environment.save();
    return apiFormSuccess();
}