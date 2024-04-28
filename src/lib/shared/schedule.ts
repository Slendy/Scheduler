import type { CachedSchedule, EventWithDate, Schedule, ScheduleEvent } from '$lib/shared/types';
import { scheduleTypes } from '$lib/shared/types';

export const defaultSchedule: Schedule = {
    scheduleId: '',
    scheduleType: 'one-time',
    scheduleDate: undefined,
    scheduleWeekdays: undefined,
    events: [],
    name: '',
    variations: []
};

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
        console.log('variation:', variation);
        if (variation.name.length === 0) {
            errors.push('All variations must have a name');
        }
        if (variation.options.length === 0) {
            errors.push('All variations must have at least one option');
        }
        console.log('past the variation checks', variation.options);
        for (let option of variation.options) {
            let timeSeconds = 0;
            for (let i = 0; i < schedule.events.length; i++) {
                let event = schedule.events[i];
                console.log(schedule.events)
                if (!event.variations) {
                    errors.push(`Event '${event.name}' is missing variations. (try recreating the event).`)
                    continue;
                }
                // skip events that aren't part of this variation, or don't skip when we don't have any variations
                if (!event.variations.includes(option) && schedule.variations.length !== 0) {
                    console.log("skipping this event check")
                    continue;
                }
                if (event.name.length === 0) {
                    errors.push(`Event #${i + 1} does not have a valid name`);
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

export function createCachedSchedule(schedule: Schedule, scheduleDate: Date): CachedSchedule | undefined {
    if (schedule == undefined) return undefined;

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