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
    schedules: [Schedule],
}

export type Schedule = {
    scheduleId: string;
    name: string;
    events: ScheduleEvent[];
    variations: ScheduleVariation[];
}

export type ScheduleEvent = {
    name: string;
    startTime: string;
    endTime: string;
    variations: string[];
};
export type ScheduleVariation = {
    name: string;
    options: string[];
};

export type CachedSchedule = {
    scheduleId: string;
    name: string;
    events: (ScheduleEvent & EventWithDate)[];
    variations: ScheduleVariation[];
};

export type EventWithDate = {
    startTimeDate: Date;
    endTimeDate: Date;
};