export const load = ({ fetch }) => {
    return {
        stats: fetch('/api/v1/admin/stats').then((response) => {
            if (response.ok) {
                return response.json()
            }
            return { totalEnvironments: 0, totalUsers: 0 }
        }),
    };
};