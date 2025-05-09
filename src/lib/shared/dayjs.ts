import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timeZone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timeZone);
dayjs.extend(duration);

export { dayjs };