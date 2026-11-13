export const display = value => value == null ? 'Unavailable' : String(value);
export const dateTime = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString() : 'Unavailable';
