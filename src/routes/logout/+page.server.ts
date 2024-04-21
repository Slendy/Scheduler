import { redirect } from "@sveltejs/kit"

export const load = async ({ cookies }) => {
    cookies.delete("auth-token", {
        path: "/",
    })
    return redirect(301, "/")
}