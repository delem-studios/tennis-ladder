import dayjs from 'dayjs';

const DEFAULT_DATE_FORMAT = 'MMMM D, YYYY';

export const formatDate = (date: string) =>
  dayjs(date).format(DEFAULT_DATE_FORMAT);
