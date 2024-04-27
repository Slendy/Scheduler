import { dev } from '$app/environment';
import { EnvironmentModel, UserModel } from '$lib/server/models.js';
import { redirect } from '@sveltejs/kit';
import { isValidObjectId } from 'mongoose';

export const load = async ({ params }) => {
    if (!dev) {
        return redirect(301, "/");
    }
    if (!isValidObjectId(params.id)) {
        return redirect(301, "/admin/debug");
    }

    if (params.type === 'environment') {
        return { serialized: JSON.stringify(await EnvironmentModel.findById(params.id), null, 4) }
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

            await EnvironmentModel.updateOne({_id: id}, parsedEnvironment)

            return { success: true }
        } else if (type === 'user') {
            let user = await UserModel.findById(id);
            if (user == null) return { success: false }

            user = JSON.parse(serialized.toString());
            if (user == null) return { success: false, message: 'Failed to parse json' }

            await user.save();

            return { success: true }
        } else {
            return redirect(301, "/admin/debug")
        }

    }
}