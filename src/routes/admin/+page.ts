import type { PageLoad } from './$types';
export const load: PageLoad = ({ fetch }) => {
    return {
        stats: fetch('/api/v1/stats').then((response) => {
            if (response.ok) {
                return response.json()
            }
            return { totalEnvironments: 0, totalUsers: 0 }
        }),
    };
};