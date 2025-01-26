"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersCollection = void 0;
exports.UsersCollection = {
    slug: "users",
    auth: true,
    labels: {
        singular: "Администратор",
        plural: "Администраторы",
    },
    admin: {
        useAsTitle: "email",
        group: "Настройки",
    },
    fields: [
    // Email added by default
    // Add more fields as needed
    ],
};
