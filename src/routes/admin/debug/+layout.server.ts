import { dev } from "$app/environment"
import { error } from "@sveltejs/kit";

export const load = () => {
    if(!dev){
        return error(404);
    }
}