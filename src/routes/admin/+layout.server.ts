export const load = ({ locals }) => {
    return { user: {
        _id: (locals.user as any)._id.toString(),
        username: locals.user.username,
    } }
}