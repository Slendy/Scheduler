export const load = async ({ parent }) => {
    const { environment } = await parent();
    return { collaboratorModalUser: undefined, environment }
};