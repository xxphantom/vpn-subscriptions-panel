"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGroups = void 0;
var uuid_1 = require("uuid");
exports.SubscriptionGroups = {
    slug: "subscription-groups",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "description"],
    },
    labels: {
        singular: "Группа подписок",
        plural: "Группы подписок",
    },
    fields: [
        {
            name: "name",
            label: "Название группы",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Описание",
            type: "textarea",
        },
        {
            name: "slug",
            label: "Идентификатор",
            type: "text",
            unique: true,
            required: true,
            defaultValue: function () { return (0, uuid_1.v4)(); },
            admin: {
                description: "Уникальный идентификатор группы (генерируется автоматически)",
                readOnly: true,
            },
        },
        // Переопределение общих настроек
        {
            name: "configOverrides",
            label: "Переопределение общих настроек",
            type: "group",
            fields: [
                {
                    name: "vpn_name",
                    label: "Имя VPN",
                    type: "text",
                },
                {
                    name: "config_update_hours",
                    label: "Интервал обновления профиля, часов",
                    type: "number",
                },
                {
                    name: "support_chat_link",
                    label: "Ссылка на поддержку",
                    type: "text",
                },
                {
                    name: "site_link",
                    label: "Ссылка на сайт VPN",
                    type: "text",
                },
                {
                    name: "announce",
                    label: "Объявление",
                    type: "text",
                },
            ],
        },
    ],
};
