export const POST = async ({ request }) => {
    const data = await request.formData();
    //TODO give out refresh token and auth token cookies (preferrably jwt so we don't have to store them in db)
    //TODO add toggleable instance settings that will be stored in db but will have defaults if they don't exist for some reason
    // each setting in DB should store it's value, the last user to edit it, and the last time it was edited (similar to cloudflare)

    //TODO: fix git info embedding: https://stackoverflow.com/a/48958120

    return Response.json({ success: true, redirect: '/admin' });
}