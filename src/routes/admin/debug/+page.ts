import { dev } from '$app/environment'
import { redirect } from '@sveltejs/kit';
export const load = async ({ fetch }) => {
    if (!dev) {
        redirect(301, "/admin")
    }
    const users = await fetch("/api/v1/users/list").then((response) => response.json()).then((json) => json.users);
    const environments = await fetch("/api/v1/environments/list").then((response) => response.json()).then((json) => json.environments);

    return { users, environments }
};