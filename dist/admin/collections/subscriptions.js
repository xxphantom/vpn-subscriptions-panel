"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
// backend/src/admin/collections/subscriptions.ts
var sanitize_url_1 = require("../../shared/sanitize-url");
var uuid_1 = require("uuid");
exports.Subscriptions = {
    slug: "subscriptions",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "expire", "subscriptionUrl", "links"],
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "slug",
            type: "text",
            unique: true,
            required: true,
            defaultValue: function () { return (0, uuid_1.v4)(); },
        },
        {
            name: "subscriptionUrl",
            type: "text",
            admin: {
                description: "URL для доступа к подписке",
                readOnly: true,
            },
            hooks: {
                beforeChange: [
                    function (_a) {
                        var data = _a.data;
                        var domain = process.env.SUBSCRIPTIONS_DOMAIN_URL || "localhost";
                        var port = process.env.SUBSCRIPTIONS_DOMAIN_PORT || "3000";
                        return "http".concat(process.env.NODE_ENV === "production" ? "s" : "", "://").concat(domain).concat(port ? ":" : "").concat(port, "/subscription/").concat((0, sanitize_url_1.sanitizeUrl)(data.name), "/").concat(data.slug);
                    },
                ],
            },
        },
        {
            name: "expire",
            label: "Дата истечения",
            type: "date",
            required: true,
        },
        {
            name: "links",
            type: "array",
            minRows: 1,
            fields: [
                {
                    name: "url",
                    type: "text",
                    required: true,
                },
            ],
        },
        // Add other fields as needed
    ],
};
