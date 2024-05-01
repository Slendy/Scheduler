import type { CachedSchedule, EventWithDate, Schedule, ScheduleEvent, ScheduleWeekdays } from '$lib/shared/types';
import { scheduleTypes, scheduleWeekdays } from '$lib/shared/types';

export const defaultSchedule: Schedule = {
    scheduleId: '',
    scheduleType: 'one-time',
    scheduleDate: undefined,
    scheduleWeekdays: undefined,
    enabled: false,
    events: [],
    name: '',
    variations: [],
};

export const MAX_SCHEDULE_NAME_LEN = 32;
export const MAX_VARIATION_NAME_LEN = 20;
export const MAX_VARIATION_OPTION_LEN = 20;
export const MAX_EVENT_NAME_LEN = 32;

export function isScheduleModified(schedule: Schedule): boolean {
    if (schedule.name !== "") return true;
    if (schedule.events.length > 0) return true;
    if (schedule.variations.length > 0) return true;
    if (schedule.scheduleId !== "") return true;

    return false;
}

export function verifySchedule(schedule: Schedule): string[] {
    let errors = [];
    if (schedule.name.length === 0) {
        errors.push('The schedule must have a name');
    }
    if (schedule.name.length > MAX_SCHEDULE_NAME_LEN) {
        errors.push(`The schedule name is too long (${schedule.name.length} > ${MAX_SCHEDULE_NAME_LEN})`);
    }
    if (!scheduleTypes.includes(schedule.scheduleType)) {
        errors.push('You must select a valid schedule type');
    }
    let variations = [...schedule.variations];
    if (variations.length === 0) {
        variations.push({ name: 'default variation', options: ['default option'] });
    }
    if (schedule.events.length === 0) {
        errors.push('Schedules must have at least one event');
    }
    for (let variation of variations) {
        if (variation.name.length === 0) {
            errors.push('All variations must have a name');
        }
        if (variation.name.length > MAX_VARIATION_NAME_LEN) {
            errors.push(`Variation name cannot be longer than ${MAX_VARIATION_NAME_LEN} characters`);
        }
        if (variation.options.length === 0) {
            errors.push('All variations must have at least one option');
        }

        for (let option of variation.options) {
            if (option.length > MAX_VARIATION_OPTION_LEN) {
                errors.push(`Variation option name is too long (${option.length} > ${MAX_VARIATION_OPTION_LEN})`)
            }
            let timeSeconds = 0;
            for (let i = 0; i < schedule.events.length; i++) {
                let event = schedule.events[i];
                if (!event.variations) {
                    errors.push(`Event '${event.name}' is missing variations. (try recreating the event).`)
                    continue;
                }
                // skip events that aren't part of this variation, or don't skip when we don't have any variations
                if (!event.variations.includes(option) && schedule.variations.length !== 0) {
                    continue;
                }
                if (event.name.length === 0) {
                    errors.push(`Event #${i + 1} does not have a valid name`);
                }
                if (event.name.length > MAX_EVENT_NAME_LEN) {
                    errors.push(`Event #${i + 1} name is too long (${event.name.length} > ${MAX_EVENT_NAME_LEN})`);
                }
                if (event.variations.length === 0 && schedule.variations.length !== 0) {
                    errors.push('Events must be a part of at least one variation');
                }
                if (event.startTime.length === 0) {
                    errors.push(`Event #${i + 1} does not have a valid start time`);
                }
                if (event.endTime.length === 0) {
                    errors.push(`Event #${i + 1} does not have a end start time`);
                }
                if (event.startTime.length !== 0 &&
                    event.endTime.length !== 0 &&
                    event.startTime === event.endTime) {
                    errors.push(`Event #${i + 1} start time and end time are the same`);
                }
                let startTime = convertTimeToSeconds(event.startTime)
                let endTime = convertTimeToSeconds(event.endTime);
                if (timeSeconds > startTime) {
                    errors.push(
                        `Event #${i + 1} start time is before event #${i} end time`
                    );
                }
                if (startTime > endTime) {
                    errors.push(`Event #${i + 1} start time is after event #${i + 1} end time`);
                }
                timeSeconds = endTime;
            }
        }

    }
    return errors;
}

export function getNextEvent(schedule: CachedSchedule | undefined, time: Date, selectedVariations: string[]): any {
    if (!schedule) {
        return undefined;
    }

    let events = schedule?.events || [];

    if (events.length == 0) {
        return undefined;
    }

    let target = undefined;
    let title = undefined;
    let inProgress = undefined;
    for (let i = 0; i < events.length; i++) {
        if (schedule.variations.length > 0 && events[i].variations.every(v => !selectedVariations.includes(v))) {
            continue;
        }

        if (
            time.getTime() >= events[i].startTimeDate.getTime() &&
            time.getTime() <= events[i].endTimeDate.getTime()
        ) {
            inProgress = true;
            target = events[i].endTimeDate;
            title = events[i].name;
        } else if (
            events[i + 1] &&
            time.getTime() >= events[i].endTimeDate.getTime() &&
            time.getTime() <= events[i + 1].startTimeDate.getTime()
        ) {
            inProgress = false;
            target = events[i + 1].startTimeDate;
            title = events[i + 1].name;
        }
    }
    if (inProgress == undefined || target == undefined || title == undefined) {
        return undefined
    }

    return { inProgress, target, title }
}

function getLastEvent(schedule: Schedule, baseDate: Date): Date {
    let highestDate = new Date(0);
    for (let event of schedule.events) {
        let eventEndDate = convertTimeToDate(event.endTime, baseDate);
        if (eventEndDate > highestDate) {
            highestDate = eventEndDate;
        }
    }
    return highestDate;
}

export function getActiveSchedule(schedules: Schedule[], date: Date): Schedule | undefined {
    if (date == null || isNaN(date.getTime())) {
        return undefined;
    }

    // TODO: if the current date is a blockout return undefined

    if (schedules.length == 0) {
        return undefined;
    }

    let smallestScheduleDistance = Number.MAX_SAFE_INTEGER;
    let smallestSchedule = undefined;

    for (let schedule of schedules) {
        if (!schedule.enabled) {
            continue;
        }

        if (schedule.scheduleType == 'one-time' && schedule.scheduleDate) {
            let scheduleDate = new Date(schedule.scheduleDate);

            let scheduleDistance = scheduleDate.getTime() - date.getTime();

            // if the beginning of the schedule day has already begun and the last event has already ended
            if (scheduleDistance < 0 && date > getLastEvent(schedule, scheduleDate)) {
                continue;
            }
            if (scheduleDistance < smallestScheduleDistance) {
                smallestScheduleDistance = scheduleDistance;
                smallestSchedule = schedule;
            }
        } else if (schedule.scheduleType == 'repeating' && schedule.scheduleWeekdays) {
            let currentDayOfWeek = date.getDay();

            for (let i = 0; i < 7; i++) {
                // if this day of week isn't included in the schedule then skip
                if (schedule.scheduleWeekdays.includes(scheduleWeekdays[i % 7])) {
                    continue;
                }
                let scheduleDate = new Date(date);
                scheduleDate.setDate(date.getDate() + 1);
                let scheduleDistance = scheduleDate.getTime() - date.getTime();

                if (scheduleDistance < 0 && date > getLastEvent(schedule, scheduleDate)) {
                    continue;
                }
                if (scheduleDistance < smallestScheduleDistance) {
                    smallestScheduleDistance = scheduleDistance;
                    smallestSchedule = schedule;
                }

                currentDayOfWeek++;
            }
        }
    }
    return smallestSchedule;
}

export function createCachedSchedule(schedule: Schedule, scheduleDate: Date): CachedSchedule | undefined {
    if (schedule == undefined) {
        return undefined;
    }

    let newEvents: (ScheduleEvent & EventWithDate)[] = [];
    for (let event of schedule.events) {
        let start = new Date(scheduleDate);
        start.setHours(0, 0, 0);
        start.setSeconds(convertTimeToSeconds(event.startTime));

        let end = new Date(scheduleDate);
        end.setHours(0, 0, 0);
        end.setSeconds(convertTimeToSeconds(event.endTime));

        newEvents.push({ ...event, startTimeDate: start, endTimeDate: end });
    }

    return { ...schedule, events: newEvents };
}

export function extractHoursAndSeconds(time: string): [number, number] {
    let components = time.split(":");
    if (components.length !== 2) return [NaN, NaN];

    let hourAndSecond = components.map((e) => parseInt(e));

    return [hourAndSecond[0], hourAndSecond[1]];
}

export function convertTimeToDate(time: string, baseDate: Date = new Date()) {
    let timeComponents = extractHoursAndSeconds(time);

    baseDate.setHours(timeComponents[0], timeComponents[1], 0)
    return baseDate;
}

export function convertTimeToSeconds(time: string): number {
    let components = time.split(":");
    if (components.length !== 2) return NaN;

    return components.map((e) => parseInt(e))
        .reduce((sum, value, index) => (index == 0 ? 60 * 60 : 60) * value + sum, 0);
}

export function prettifyWeekday(weekday: string) {
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

export function prettifyWeekdayList(daysOfWeek: string[]) {
    let weekdays: ScheduleWeekdays[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let weekends: ScheduleWeekdays[] = ['saturday', 'sunday'];
    if (weekdays.every(d => daysOfWeek.includes(d) && weekends.every(d => daysOfWeek.includes(d)))) {
        return "Everyday";
    } else if (weekdays.every(d => daysOfWeek.includes(d) && !weekends.some(d => daysOfWeek.includes(d)))) {
        return "Weekdays";
    } else if (weekends.every(d => daysOfWeek.includes(d) && !weekdays.some(d => daysOfWeek.includes(d)))) {
        return "Weekends"
    }
    return daysOfWeek.slice(0, daysOfWeek.length - 1).map(d => prettifyWeekday(d).slice(0, 3)).join(", ")
        + " and " +
        prettifyWeekday(daysOfWeek[daysOfWeek.length - 1].slice(0, 3));
}