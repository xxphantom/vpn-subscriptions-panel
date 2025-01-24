"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToUnixTimestamp = void 0;
/**
 * Converts a date string to Unix timestamp (seconds since epoch)
 * @param dateStr - Date string that can be parsed by Date constructor
 * @returns number - Unix timestamp in seconds
 */
var dateToUnixTimestamp = function (dateStr) {
    return Math.floor(new Date(dateStr).getTime() / 1000);
};
exports.dateToUnixTimestamp = dateToUnixTimestamp;
