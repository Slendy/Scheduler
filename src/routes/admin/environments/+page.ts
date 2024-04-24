export const load = ({ fetch }) => {
    return {
        environments: fetch('/api/v1/admin/environments/list').then((response) => response.json()).then((json) => json.environments)
    };
};