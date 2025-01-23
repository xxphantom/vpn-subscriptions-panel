"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
var uuid_1 = require("uuid");
exports.Subscriptions = {
    slug: "subscriptions",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["title", "expire"],
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
            // Можно сгенерировать slug в beforeValidate-хуке, если хотите
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
                        return "http".concat(process.env.NODE_ENV === "production" ? "s" : "", "://").concat(domain).concat(port ? ":" : "").concat(port, "/subscription/").concat(data.slug);
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
