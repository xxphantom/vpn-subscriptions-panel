/**
 * Converts a date string to Unix timestamp (seconds since epoch)
 * @param dateStr - Date string that can be parsed by Date constructor
 * @returns number - Unix timestamp in seconds
 */
export const dateToUnixTimestamp = (dateStr: string): number => {
    return Math.floor(new Date(dateStr).getTime() / 1000);
};
