enum EnvironmentPermissions {
    None,
    ViewEnvironment = 1 << 1,
    ViewSchedules = 1 << 2,
    EditSchedules = 1 << 3,



    EditEnvironment = 1 << 5,

    DeleteEnvironment = 1 << 10,
    DeleteSchedules = 1 << 11,
}