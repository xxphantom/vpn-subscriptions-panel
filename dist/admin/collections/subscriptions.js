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
    labels: {
        singular: "Подписка",
        plural: "Подписки",
    },
    fields: [
        {
            name: "name",
            label: "Имя",
            type: "text",
            required: true,
        },
        {
            name: "group",
            label: "Группа",
            type: "relationship",
            relationTo: "subscription-groups",
            admin: {
                description: "Группа подписки. Если выбрана, настройки группы будут иметь приоритет над общими настройками",
            },
        },
        {
            name: "slug",
            label: "Идентификатор",
            type: "text",
            unique: true,
            required: true,
            defaultValue: function () { return (0, uuid_1.v4)(); },
            admin: {
                description: "Уникальный идентификатор подписки (генерируется автоматически)",
                readOnly: true,
            },
        },
        {
            name: "subscriptionUrl",
            label: "URL подписки",
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
            admin: {
                description: "Дата окончания действия подписки",
            },
        },
        {
            name: "links",
            label: "Ссылки",
            type: "array",
            minRows: 1,
            admin: {
                description: "Список ссылок для подключения",
            },
            fields: [
                {
                    name: "url",
                    label: "URL",
                    type: "text",
                    required: true,
                    admin: {
                        description: "Ссылка для подключения в формате vless://...",
                    },
                },
            ],
        },
        // Add other fields as needed
    ],
};
