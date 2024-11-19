import type { CachedSchedule, EventWithDate, Schedule, ScheduleEvent, ScheduleWeekdays, ScheduleWithDate } from '$lib/shared/types';
import { scheduleTypes, scheduleWeekdays } from '$lib/shared/types';
import type { Dayjs } from 'dayjs';
import { dayjs } from './dayjs';

export const defaultSchedule: Schedule = {
    scheduleId: '',
    scheduleType: 'one-time',
    scheduleDate: undefined,
    scheduleWeekdays: undefined,
    scheduleTimeZone: undefined,
    enabled: false,
    events: [],
    name: '',
    variations: [],
};

export const MAX_SCHEDULE_NAME_LEN = 32;
export const MAX_VARIATION_NAME_LEN = 20;
export const MAX_VARIATION_OPTION_LEN = 20;
export const MAX_EVENT_NAME_LEN = 32;

export function isScheduleEmpty(schedule: Schedule): boolean {
    if (schedule.name !== "") return true;
    if (schedule.events.length > 0) return true;
    if (schedule.variations.length > 0) return true;
    if (schedule.scheduleId !== "") return true;

    return false;
}

export function verifySchedule(schedule: Schedule): string[] {
    let errors: string[] = [];
    function addError(error: string) {
        if (!errors.includes(error)) {
            errors.push(error);
        }
    }
    if (schedule.name.length === 0) {
        addError('The schedule must have a name');
    }
    if (schedule.name.length > MAX_SCHEDULE_NAME_LEN) {
        addError(`The schedule name is too long (${schedule.name.length} > ${MAX_SCHEDULE_NAME_LEN})`);
    }
    if (!scheduleTypes.includes(schedule.scheduleType)) {
        addError('You must select a valid schedule type');
    }
    let variations = [...schedule.variations];
    if (variations.length === 0) {
        variations.push({ name: 'default variation', options: ['default option'] });
    }
    if (schedule.events.length === 0) {
        addError('Schedules must have at least one event');
    }
    for (let variation of variations) {
        if (variation.name.length === 0) {
            addError('All variations must have a name');
        }
        if (variation.name.length > MAX_VARIATION_NAME_LEN) {
            addError(`Variation name cannot be longer than ${MAX_VARIATION_NAME_LEN} characters`);
        }
        if (variation.options.length === 0) {
            addError('All variations must have at least one option');
        }

        for (let option of variation.options) {
            if (option.length > MAX_VARIATION_OPTION_LEN) {
                addError(`Variation option name is too long (${option.length} > ${MAX_VARIATION_OPTION_LEN})`)
            }
            let timeSeconds = 0;
            for (let i = 0; i < schedule.events.length; i++) {
                let event = schedule.events[i];
                if (!event.variations) {
                    addError(`Event '${event.name}' is missing variations. (try recreating the event).`)
                    continue;
                }
                // skip events that aren't part of this variation, or don't skip when we don't have any variations
                if (!event.variations.includes(option) && schedule.variations.length !== 0) {
                    continue;
                }
                if (event.name.length === 0) {
                    addError(`Event #${i + 1} does not have a valid name`);
                }
                if (event.name.length > MAX_EVENT_NAME_LEN) {
                    addError(`Event #${i + 1} name is too long (${event.name.length} > ${MAX_EVENT_NAME_LEN})`);
                }
                if (event.variations.length === 0 && schedule.variations.length !== 0) {
                    addError('Events must be a part of at least one variation');
                }
                if (event.startTime.length === 0) {
                    addError(`Event #${i + 1} does not have a valid start time`);
                }
                if (event.endTime.length === 0) {
                    addError(`Event #${i + 1} does not have a end start time`);
                }
                if (event.startTime.length !== 0 &&
                    event.endTime.length !== 0 &&
                    event.startTime === event.endTime) {
                    addError(`Event #${i + 1} start time and end time are the same`);
                }
                let startTime = convertTimeToSeconds(event.startTime)
                let endTime = convertTimeToSeconds(event.endTime);
                if (timeSeconds > startTime) {
                    addError(
                        `Event #${i + 1} start time is before event #${i} end time (${schedule.events[i + 1].startTime} > ${event.endTime})`
                    );
                }
                if (startTime > endTime) {
                    addError(`Event #${i + 1} start time is after event #${i + 1} end time`);
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
    let inProgress = false;
    let highestTime = 0;
    let soonestEvent: { time: number, event: any } = { time: Number.MAX_SAFE_INTEGER, event: undefined };
    for (let i = 0; i < events.length; i++) {
        if (schedule.variations.length > 0 && events[i].variations.every(v => !selectedVariations.includes(v))) {
            continue;
        }

        if (events[i].endTimeDate.getTime() > highestTime) {
            highestTime = events[i].endTimeDate.getTime();
        }

        // if event is ongoing
        if (time.getTime() >= events[i].startTimeDate.getTime() &&
            time.getTime() <= events[i].endTimeDate.getTime()) {
            inProgress = true;
            target = events[i].endTimeDate;
            title = events[i].name;
        } else {
            // track when next event is
            let eventDelta = events[i].startTimeDate.getTime() - time.getTime();
            if (eventDelta > 0 && eventDelta < soonestEvent.time) {
                soonestEvent.event = events[i];
                soonestEvent.time = eventDelta;
            }
        }
    }

    if (time.getTime() > highestTime) {
        return undefined;
    }

    // if we are not in the middle of an event then set the next event as the closest in the future
    if (target == undefined) {
        target = soonestEvent.event.startTimeDate;
        title = soonestEvent.event.name;
        inProgress = false;
    }

    return { inProgress, target, title }
}

export function getLastEvent(schedule: Schedule, baseDate: Dayjs): Dayjs | undefined {
    let highestDate: Dayjs | undefined;
    for (let event of schedule.events) {
        let eventEndDate = convertTimeToDate(event.endTime, baseDate);
        if (highestDate == null || eventEndDate.isAfter(highestDate)) {
            highestDate = eventEndDate;
        }
    }

    return highestDate;
}

//TODO implement
export function isDateBlockout(date: Dayjs) {
    return false;
}

export function getActiveSchedule(schedules: Schedule[], zonedDate: Dayjs, timeZone: string): ScheduleWithDate | undefined {
    if (!schedules?.length || schedules.length === 0) {
        console.error("getActiveSchedule(): List of input schedules is empty.")
        return undefined;
    }

    if (zonedDate == null || !zonedDate.isValid()) {
        console.error("getActiveSchedule(): Input date is invalid.");
        return undefined;
    }

    if (!timeZone || timeZone.length == 0) {
        console.error("getActiveSchedule(): Input timezone is invalid")
    }

    let date = zonedDate.toDate();

    let scheduleDistances: { schedule: any, scheduleDate: any, scheduleDistance: any }[] = [];

    let overrideDays: string[] = [];

    processOneTimeSchedules();
    processRepeatingSchedules();

    scheduleDistances.sort((a, b) => {
        // schedules with specific dates should be chosen over a repeating schedules
        if (a.schedule.scheduleType == 'one-time' && b.schedule.scheduleType == 'repeating') {
            return -1;
        } else if (b.schedule.scheduleType == 'one-time' && a.schedule.scheduleType == 'repeating') {
            return 1;
        }

        return a.scheduleDistance - b.scheduleDistance;
    })

    return scheduleDistances[0] || undefined;

    function processOneTimeSchedules() {
        // process one-time schedules
        for (let schedule of schedules) {
            if (!schedule.enabled) {
                continue;
            }
            if (schedule.scheduleType != 'one-time' || !schedule.scheduleDate) {
                continue;
            }

            let scheduleDate = dayjs.tz(schedule.scheduleDate, timeZone).startOf('day');

            // if more than 2 days have passed it's safe to skip
            if (zonedDate.diff(scheduleDate, 'day') > 2) {
                continue;
            }

            if (isDateBlockout(scheduleDate)) {
                continue;
            }

            overrideDays.push(scheduleDate.toISOString());

            let scheduleDistance = scheduleDate.unix() - zonedDate.unix();

            let lastEvent = getLastEvent(schedule, scheduleDate);
            if (lastEvent == null) {
                console.error("Schedule " + schedule.scheduleId + " has no last event");
                continue;
            }

            // if the beginning of the schedule day has already begun and the last event has already ended
            if (scheduleDistance < 0 && zonedDate.isAfter(lastEvent)) {
                continue;
            }

            scheduleDistances.push({ scheduleDistance, scheduleDate, schedule });
        }
    }

    function processRepeatingSchedules() {
        for (let schedule of schedules) {
            if (!schedule.enabled) {
                continue;
            }

            if (schedule.scheduleType != 'repeating' || !schedule.scheduleWeekdays) {
                continue;
            }

            let currentDayOfWeek = date.getDay();

            for (let i = 0; i < 7; i++) {
                // if this day of week isn't included in the schedule then skip
                if (!schedule.scheduleWeekdays.includes(scheduleWeekdays[i % 7])) {
                    continue;
                }
                let scheduleDate = dayjs.tz(date, timeZone).startOf('day').set('day', i);

                // if we have to look ahead a whole year it's chalked
                const MAX_LOOKAHEAD = 52;
                let iterations = 0;
                // skip dates that have already passed, are blocked out, or already have a one-time schedule
                while ((scheduleDate.isBefore(zonedDate.startOf('day') as any)
                    || isDateBlockout(scheduleDate)
                    || overrideDays.includes(scheduleDate.toISOString()))
                    && iterations < MAX_LOOKAHEAD) {
                    scheduleDate = scheduleDate.set('date', scheduleDate.date() + 7).startOf('day');
                    iterations++;
                }
                let scheduleDistance = scheduleDate.unix() - zonedDate.unix();

                let lastEvent = getLastEvent(schedule, scheduleDate);
                if (lastEvent == null) {
                    console.error("Schedule " + schedule.scheduleId + " has no last event");
                    continue;
                }

                if (scheduleDistance < 0 && zonedDate.isAfter(lastEvent)) {
                    continue;
                }

                scheduleDistances.push({ scheduleDistance, scheduleDate, schedule });

                currentDayOfWeek++;
            }
        }
    }
}

export function createCachedSchedule(schedule: Schedule, scheduleDate: Dayjs): CachedSchedule | undefined {
    if (schedule == undefined) {
        return undefined;
    }

    let newEvents: (ScheduleEvent & EventWithDate)[] = [];
    for (let event of schedule.events) {
        let start = scheduleDate.startOf('day').set('second', convertTimeToSeconds(event.startTime));
        let end = scheduleDate.startOf('day').set('second', convertTimeToSeconds(event.endTime));

        newEvents.push({ ...event, startTimeDate: start.toDate(), endTimeDate: end.toDate() });
    }

    return { ...schedule, events: newEvents };
}

export function extractHoursAndSeconds(time: string): [number, number] {
    let components = time.split(":");
    if (components.length !== 2) return [NaN, NaN];

    let hourAndSecond = components.map((e) => parseInt(e));

    return [hourAndSecond[0], hourAndSecond[1]];
}

export function convertTimeToDate(time: string, baseDate: Dayjs) {
    let timeComponents = extractHoursAndSeconds(time);

    return baseDate.startOf('day').set('hour', timeComponents[0]).set('minute', timeComponents[1]);
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