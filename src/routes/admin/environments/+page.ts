import type { PageLoad } from './$types';
export const load: PageLoad = ({ fetch }) => {
    return {
        environments: fetch('/api/v1/environments/list').then((response) => response.json()).then((json) => json.environments)
    };
};