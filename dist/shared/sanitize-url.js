"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUrl = void 0;
function sanitizeUrl(str) {
    var replacedSpaces = str.replace(/\s+/g, "-");
    return replacedSpaces.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();
}
exports.sanitizeUrl = sanitizeUrl;
