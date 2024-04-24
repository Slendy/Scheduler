import { error } from '@sveltejs/kit';

export const load = ({ fetch }) => {
    return {
        users: fetch('/api/v1/admin/users/list').then((response) => {
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