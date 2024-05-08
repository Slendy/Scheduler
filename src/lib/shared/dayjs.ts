import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';
import timeZone from 'dayjs/esm/plugin/timezone';
import duration from 'dayjs/esm/plugin/duration';
import utc from 'dayjs/esm/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timeZone);
dayjs.extend(duration);

export { dayjs };