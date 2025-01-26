"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedConfig = void 0;
exports.SharedConfig = {
    slug: "shared-config",
    label: "Общий конфиг VPN",
    admin: {
        group: "Настройки",
    },
    fields: [
        {
            name: "vpn_name",
            label: "Имя VPN",
            type: "text",
            required: true,
            defaultValue: "",
        },
        {
            name: "config_update_hours",
            label: "Интервал обновления профиля, часов",
            type: "number",
            required: true,
            defaultValue: 1,
        },
        {
            name: "support_chat_link",
            label: "Ссылка на поддержку",
            type: "text",
            required: true,
            defaultValue: "",
        },
        {
            name: "site_link",
            label: "Ссылка на сайт VPN",
            type: "text",
            required: true,
            defaultValue: "",
        },
        {
            name: "announce",
            label: "Объявление",
            type: "text",
            required: true,
            defaultValue: "При возникновении проблем с VPN обращайтесь в поддержку",
        },
    ],
};
