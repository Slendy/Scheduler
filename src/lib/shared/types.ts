import type { Dayjs } from "dayjs";

export interface IUser {
    username: String;
    permissionMap: Record<string, string>;
    isAdmin: Boolean;
    passwordHash: String;
}

export const scheduleTypes = ['repeating', 'one-time'] as const;
export type ScheduleType = typeof scheduleTypes[number];

export const scheduleWeekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type ScheduleWeekdays = typeof scheduleWeekdays[number];

export type ScheduleWithDate = {
    schedule: Schedule;
    scheduleDate: Dayjs;
}

export type Schedule = {
    scheduleId: string;
    scheduleType: ScheduleType;
    scheduleDate: string | undefined;
    scheduleWeekdays: ScheduleWeekdays[] | undefined;
    enabled: boolean;
    name: string;
    events: ScheduleEvent[];
    variations: ScheduleVariation[];
}

export type ScheduleEvent = {
    eventId: string;
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