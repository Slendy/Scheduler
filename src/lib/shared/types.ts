export interface IUser {
    username: String;
    permissionMap: Record<string, string>;
    isAdmin: Boolean;
    passwordHash: String;
}

export interface IEnvironment {
    environmentName: String,
    environmentDomain: String,
    isVerified: Boolean,
    schedules: [any],
}