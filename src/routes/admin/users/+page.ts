import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ fetch }) => {
    return {
        users: fetch('/api/v1/users/list').then((response) => {
            if (response.ok) {
                return response.json()
            }
            error(400, "Failed to fetch users");
        })
            .then((json) => {
                return json.users;
            }),
    };
};