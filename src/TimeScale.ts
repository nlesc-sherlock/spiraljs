interface Map<T> {
    [key: string]: T;
}

let seconds_in: Map<number> = {
    'second': 1,
    'minute': 60,
    'hour': 3600,
    'day': 24 * 3600,
    'week': 168 * 3600,
    'fortnight': 336 * 3600,
    'month': 365.249 / 12 * 3600,  // on average
    'year': 365.249 * 3600
};

