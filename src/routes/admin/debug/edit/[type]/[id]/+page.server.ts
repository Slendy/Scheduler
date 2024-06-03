import { dev } from '$app/environment';
import { EnvironmentModel, UserModel } from '$lib/server/models.js';
import { redirect } from '@sveltejs/kit';
import { isValidObjectId } from 'mongoose';

export const load = async ({ params }) => {
    if (!isValidObjectId(params.id)) {
        return redirect(301, "/admin/debug");
    }

    if (params.type === 'environment') {
        let environment = (await EnvironmentModel.findById(params.id))?.toObject({getters: true});
        if (environment == null) return null;
        environment.environmentIcon = environment.environmentIcon.toString('base64');
        return { serialized: JSON.stringify(environment, null, 4) }
    } else if (params.type === 'user') {
        return { serialized: JSON.stringify(await UserModel.findById(params.id), null, 4) }
    } else {
        return redirect(301, "/admin/debug")
    }
}

export const actions = {
    default: async (event) => {
        const { type, id } = event.params;
        const data = await event.request.formData();
        const serialized = data.get('serialized-data');
        if (serialized == null) return { success: false }

        if (type === 'environment') {
            let environment = await EnvironmentModel.findById(id);
            if (environment == null) return { success: false }

            let parsedEnvironment = JSON.parse(serialized.toString());
            if (parsedEnvironment == null) return { success: false, message: 'Failed to parse json' }

            // convert from base64 since we serve the image data b64 encoded
            parsedEnvironment.environmentIcon = Buffer.from(parsedEnvironment.environmentIcon, 'base64');

            return { success: true }
        } else if (type === 'user') {
            let user = await UserModel.findById(id);
            if (user == null) return { success: false }

            let parsedUser = JSON.parse(serialized.toString());
            if (parsedUser == null) return { success: false, message: 'Failed to parse json' }

            await UserModel.updateOne({ id: id }, parsedUser);

            return { success: true }
        } else {
            return redirect(301, "/admin/debug")
        }

    }
}