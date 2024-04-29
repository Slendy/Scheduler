import { redirect } from "@sveltejs/kit"
import { TokenModel } from "$lib/server/models.js";

export const load = async ({ cookies }) => {
    let authCookie = cookies.get("auth-token");
    if (authCookie != null) {
        await TokenModel.deleteOne({ authToken: authCookie })
    }

    cookies.delete("auth-token", {
        path: "/",
    })
    cookies.delete("refresh-token", {
        path: "/",
    })

    return redirect(301, "/")
}