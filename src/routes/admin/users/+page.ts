import type { PageLoad } from './$types';
export const load: PageLoad = ({ fetch }) => {
    return {
        users: fetch('http://localhost:5001/api/v1/users/list').then((response) => response.json()).then((response) => response)
    };
};