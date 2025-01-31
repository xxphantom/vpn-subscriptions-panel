"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64 = void 0;
var encodeBase64 = function (str) {
    var encoded = Buffer.from(str).toString("base64");
    return "base64:".concat(encoded);
};
exports.encodeBase64 = encodeBase64;
