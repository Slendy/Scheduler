import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, params }) => {
    const { userId } = params;
    let user = await fetch('/api/v1/admin/users/id/' + userId)
        .then((response) => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        })
        .catch((error) => {
            console.error(error);
        })
    if (user == null) {
        return redirect(301, "/admin/users");
    }
    return { user };
};