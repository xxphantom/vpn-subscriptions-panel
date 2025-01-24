"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var plugin_cloud_1 = require("@payloadcms/plugin-cloud");
var db_postgres_1 = require("@payloadcms/db-postgres");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var config_1 = require("payload/config");
var users_1 = require("./admin/collections/users");
var sharedConfig_1 = require("./admin/globals/sharedConfig");
var subscriptions_1 = require("./admin/collections/subscriptions");
exports.default = (0, config_1.buildConfig)({
    admin: {
        user: users_1.UsersCollection.slug,
        bundler: (0, bundler_webpack_1.webpackBundler)(),
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    collections: [users_1.UsersCollection, subscriptions_1.Subscriptions],
    globals: [sharedConfig_1.SharedConfig],
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
    graphQL: {
        schemaOutputFile: path_1.default.resolve(__dirname, "generated-schema.graphql"),
    },
    plugins: [(0, plugin_cloud_1.payloadCloud)()],
    db: (0, db_postgres_1.postgresAdapter)({
        pool: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT || "5432"),
        },
    }),
});
