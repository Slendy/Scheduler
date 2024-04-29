import { getUserFromCookie } from '$lib/server/auth';
import { connectToDb, generateDefaultEnvironment, generateDefaultUser } from '$lib/server/db';
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

try {
    console.log("Connecting to database...")
    await connectToDb();
    await generateDefaultUser();
    await generateDefaultEnvironment();
    console.log("Connected to database");
} catch (error) {
    console.log("Failed to connect to database:")
    console.log(error);
    process.exit();
}

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = await getUserFromCookie(event.cookies);

    if (event.url.pathname.startsWith("/admin") && (!event.locals.user?.isAdmin || false)) {
        throw redirect(301, "/");
    }

    if (event.url.pathname.startsWith("/api/v1/admin") && (!event.locals.user?.isAdmin || false)) {
        return error(403);
    }

    return await resolve(event);
}