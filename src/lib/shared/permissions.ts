export enum EnvironmentPermissions {
    None,
    ViewEnvironment = 1 << 1,
    ViewSchedules = 1 << 2,


    EditSchedules = 1 << 10,
    CreateSchedules = 1 << 11,
    EditEnvironment = 1 << 12,
    EditBlockouts = 1 << 13,

    DeleteEnvironment = 1 << 20,
    DeleteSchedules = 1 << 21,

    ReadOnly = ViewEnvironment | ViewSchedules,
    Editor = ReadOnly | EditSchedules | EditBlockouts | CreateSchedules | EditEnvironment,
    Admin = Editor | DeleteEnvironment | DeleteSchedules,
}

export namespace EnvironmentPermissions {
    export function toPrettyString(perms: EnvironmentPermissions) {
        if ((perms & EnvironmentPermissions.ReadOnly) == EnvironmentPermissions.ReadOnly) {
            return 'Read-Only';
        }
        else if ((perms & EnvironmentPermissions.Editor) == EnvironmentPermissions.Editor) {
            return 'Editor';
        }
        else if ((perms & EnvironmentPermissions.Admin) == EnvironmentPermissions.Admin) {
            return 'Admin';
        }
        else if (perms == 0) {
            return 'None';
        }

        return 'Custom';
    }
}

export function hasPermission(user: any, environment: any, permissions: EnvironmentPermissions): boolean {
    if (environment.environmentOwner.toString() === user._id.toString()) {
        return true;
    }

    let userPermissions = environment.environmentCollaborators.findOne((c: any) => c._id.toString() == user._id.toString())?.permissions || EnvironmentPermissions.None;
    if ((userPermissions & permissions) == permissions) return true;

    return false;
}
