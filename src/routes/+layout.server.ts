import { redirect } from "@sveltejs/kit";

export const load = ({ url, locals }) => {
    if (url.pathname.startsWith("/admin") && (!locals.user?.isAdmin)) {
        throw redirect(301, "/");
    }
}