import { redirect } from '@sveltejs/kit';
import { EnvironmentModel } from '$lib/server/models';

export const load = async ({ locals }) => {
	if (locals.user == null) {
		throw redirect(301, '/login');
	}

	let environments = await EnvironmentModel.find({
		$or: [{ environmentOwner: locals.user.id }, {
			'environmentCollaborators._id':
			locals
				.user.id
		}]
	}).populate('environmentCollaborators.user');

	let environmentsResponse = (await Promise.all(environments.map(env => env.toApiResponse())))
		.map(env => ({ ...env, totalSchedules: env.schedules.length }))
		.map(({ schedules, ...rest }) => rest);
	//

	// console.log(environmentsResponse[0].environmentCollaborators[0].user);

	return { environments: environmentsResponse };
};