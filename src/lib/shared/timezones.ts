export let timeZoneNames = Intl.supportedValuesOf('timeZone').map((tz) => {
    const offset = new Intl.DateTimeFormat('en', {
        timeZone: tz,
        timeZoneName: 'shortOffset'
    })
        .formatToParts()
        .find((part) => part.type === 'timeZoneName')?.value;

    return { name: tz, offset };
});

export function isValidTimeZone(timeZone: string): boolean {
    return timeZoneNames.map(tzObject => tzObject.name).includes(timeZone);
}
