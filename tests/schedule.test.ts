import { expect, test } from 'bun:test';
import { convertTimeToDate, convertTimeToSeconds, getLastEvent, defaultSchedule, createCachedSchedule, getNextEvent, getActiveSchedule } from '$lib/shared/schedule'
import { type Schedule } from '$lib/shared/types';
import { dayjs } from '$lib/shared/dayjs';

const testSchedule: Schedule = {
    ...defaultSchedule,
    events: [
        {
            eventId: '',
            name: 'event 1',
            startTime: '2:08',
            endTime: '5:08',
            variations: [],
        },
        {
            eventId: '',
            name: 'event 2',
            startTime: '5:08',
            endTime: '10:08',
            variations: [],
        },
        {
            eventId: '',
            name: 'event 3',
            startTime: '10:08',
            endTime: '20:08',
            variations: [],
        }
    ],
}

test('get the last event in a schedule', () => {
    let schedule: Schedule = { ...testSchedule };
    let scheduleDate = dayjs('2020-4-20', 'UTC').startOf('day');
    expect(getLastEvent(schedule, scheduleDate)?.valueOf() ?? -1).toBe(1587413280000);
});

test('get the next event in a schedule with no variations given a time', () => {
    let schedule: Schedule = { ...testSchedule };
    let scheduleDate = dayjs('2020-4-20', 'UTC').startOf('day');
    let cachedSchedule = createCachedSchedule(schedule, scheduleDate);
    expect(cachedSchedule).not.toBeNull();
    expect(getNextEvent(undefined, new Date(), [])).toBeUndefined();
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 1).toDate(), [])).toEqual({
        inProgress: false,
        target: new Date("2020-04-20T02:08:00.000Z"),
        title: "event 1",
    })
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 11).toDate(), [])).toEqual({
        inProgress: true,
        target: new Date("2020-04-20T20:08:00.000Z"),
        title: "event 3",
    });
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 21).toDate(), [])).toBeUndefined();
})

test('get the next event in a schedule with variations given a time', () => {
    let schedule: Schedule = {
        ...testSchedule, variations: [{
            name: "test",
            options: ["test"],
        }],
        events: testSchedule.events.map(e => ({ ...e, variations: ["test"] })),
    };
    let scheduleDate = dayjs('2020-4-20', 'UTC').startOf('day');
    let cachedSchedule = createCachedSchedule(schedule, scheduleDate);
    expect(cachedSchedule).not.toBeNull();
    expect(getNextEvent(cachedSchedule, scheduleDate.toDate(), ["oof"])).toBeUndefined();
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 1).toDate(), ["test"])).toEqual({
        inProgress: false,
        target: new Date("2020-04-20T02:08:00.000Z"),
        title: "event 1",
    });
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 11).toDate(), ["test"])).toEqual({
        inProgress: true,
        target: new Date("2020-04-20T20:08:00.000Z"),
        title: "event 3",
    });
    expect(getNextEvent(cachedSchedule, scheduleDate.set('hour', 21).toDate(), ["test"])).toBeUndefined();
})

test('get active schedule in an environment', () => {
    let schedules: Schedule[] = [
        { ...testSchedule, scheduleDate: '2020-4-20', scheduleType: 'one-time', enabled: true, scheduleId: '1' },
        { ...testSchedule, scheduleWeekdays: ['monday', 'tuesday', 'wednesday'], scheduleType: 'repeating', enabled: true, scheduleId: '2' }
    ];

    // this is a monday
    let date = dayjs('2020-4-20', 'UTC').startOf('day');

    // one-time schedule should override repeating schedule
    expect(getActiveSchedule(schedules, date, 'UTC')).toSatisfy(s => s.schedule?.scheduleId == '1' && s.scheduleDate.toISOString() == '2020-04-20T00:00:00.000Z');
    // repeating schedule looks ahead
    expect(getActiveSchedule(schedules, date.set('date', date.date() + 1), 'UTC')).toSatisfy(s => s.schedule?.scheduleId == '2' && s.scheduleDate.toISOString() == '2020-04-21T00:00:00.000Z');
    // repeating schedule will go to the next week if the current week has passed
    expect(getActiveSchedule(schedules, date.set('date', date.date() + 3), 'UTC')).toSatisfy(s => s.schedule?.scheduleId == '2' && s.scheduleDate.toISOString() == '2020-04-27T00:00:00.000Z');
});

test('splits hh:mm into individual components', () => {
    expect(convertTimeToSeconds('00')).toBe(NaN);
    expect(convertTimeToSeconds('00:00:00')).toBe(NaN);
    expect(convertTimeToSeconds('')).toBe(NaN);
    expect(convertTimeToSeconds('00:00')).toBe(0);
    expect(convertTimeToSeconds('01:00')).toBe(3600);
    expect(convertTimeToSeconds('23:59')).toBe(86340);
});

test('converts string time into date', () => {
    let baseDate = dayjs.tz('2020-4-20', 'UTC').startOf('day');

    expect(convertTimeToDate('00:00', baseDate).valueOf()).toBe(1587340800000);
    expect(convertTimeToDate('9:08', baseDate).valueOf()).toBe(1587373680000);
    expect(convertTimeToDate('23:07', baseDate).valueOf()).toBe(1587424020000);
});