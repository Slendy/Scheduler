import type { PageLoad } from './$types';
export const load: PageLoad = ({ fetch }) => {
    return {
        environments: fetch('http://localhost:5001/api/v1/environment/list').then((response) => response.json()).then((response) => response)
    };
};