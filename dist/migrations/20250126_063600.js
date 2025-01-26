"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
var drizzle_orm_1 = require("drizzle-orm");
function up(_a) {
    var payload = _a.payload;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, payload.db.drizzle.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\nCREATE TABLE IF NOT EXISTS \"subscriptions_rels\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"order\" integer,\n\t\"parent_id\" integer NOT NULL,\n\t\"path\" varchar NOT NULL,\n\t\"subscription_groups_id\" integer\n);\n\nCREATE TABLE IF NOT EXISTS \"subscription_groups\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"name\" varchar NOT NULL,\n\t\"description\" varchar,\n\t\"slug\" varchar NOT NULL,\n\t\"config_overrides_vpn_name\" varchar,\n\t\"config_overrides_config_update_hours\" numeric,\n\t\"config_overrides_support_chat_link\" varchar,\n\t\"config_overrides_site_link\" varchar,\n\t\"config_overrides_announce\" varchar,\n\t\"updated_at\" timestamp(3) with time zone DEFAULT now() NOT NULL,\n\t\"created_at\" timestamp(3) with time zone DEFAULT now() NOT NULL\n);\n\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_order_idx\" ON \"subscriptions_rels\" (\"order\");\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_parent_idx\" ON \"subscriptions_rels\" (\"parent_id\");\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_path_idx\" ON \"subscriptions_rels\" (\"path\");\nCREATE UNIQUE INDEX IF NOT EXISTS \"subscription_groups_slug_idx\" ON \"subscription_groups\" (\"slug\");\nCREATE INDEX IF NOT EXISTS \"subscription_groups_created_at_idx\" ON \"subscription_groups\" (\"created_at\");\nDO $$ BEGIN\n ALTER TABLE \"subscriptions_rels\" ADD CONSTRAINT \"subscriptions_rels_parent_fk\" FOREIGN KEY (\"parent_id\") REFERENCES \"subscriptions\"(\"id\") ON DELETE cascade ON UPDATE no action;\nEXCEPTION\n WHEN duplicate_object THEN null;\nEND $$;\n\nDO $$ BEGIN\n ALTER TABLE \"subscriptions_rels\" ADD CONSTRAINT \"subscriptions_rels_subscription_groups_fk\" FOREIGN KEY (\"subscription_groups_id\") REFERENCES \"subscription_groups\"(\"id\") ON DELETE cascade ON UPDATE no action;\nEXCEPTION\n WHEN duplicate_object THEN null;\nEND $$;\n"], ["\n\nCREATE TABLE IF NOT EXISTS \"subscriptions_rels\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"order\" integer,\n\t\"parent_id\" integer NOT NULL,\n\t\"path\" varchar NOT NULL,\n\t\"subscription_groups_id\" integer\n);\n\nCREATE TABLE IF NOT EXISTS \"subscription_groups\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"name\" varchar NOT NULL,\n\t\"description\" varchar,\n\t\"slug\" varchar NOT NULL,\n\t\"config_overrides_vpn_name\" varchar,\n\t\"config_overrides_config_update_hours\" numeric,\n\t\"config_overrides_support_chat_link\" varchar,\n\t\"config_overrides_site_link\" varchar,\n\t\"config_overrides_announce\" varchar,\n\t\"updated_at\" timestamp(3) with time zone DEFAULT now() NOT NULL,\n\t\"created_at\" timestamp(3) with time zone DEFAULT now() NOT NULL\n);\n\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_order_idx\" ON \"subscriptions_rels\" (\"order\");\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_parent_idx\" ON \"subscriptions_rels\" (\"parent_id\");\nCREATE INDEX IF NOT EXISTS \"subscriptions_rels_path_idx\" ON \"subscriptions_rels\" (\"path\");\nCREATE UNIQUE INDEX IF NOT EXISTS \"subscription_groups_slug_idx\" ON \"subscription_groups\" (\"slug\");\nCREATE INDEX IF NOT EXISTS \"subscription_groups_created_at_idx\" ON \"subscription_groups\" (\"created_at\");\nDO $$ BEGIN\n ALTER TABLE \"subscriptions_rels\" ADD CONSTRAINT \"subscriptions_rels_parent_fk\" FOREIGN KEY (\"parent_id\") REFERENCES \"subscriptions\"(\"id\") ON DELETE cascade ON UPDATE no action;\nEXCEPTION\n WHEN duplicate_object THEN null;\nEND $$;\n\nDO $$ BEGIN\n ALTER TABLE \"subscriptions_rels\" ADD CONSTRAINT \"subscriptions_rels_subscription_groups_fk\" FOREIGN KEY (\"subscription_groups_id\") REFERENCES \"subscription_groups\"(\"id\") ON DELETE cascade ON UPDATE no action;\nEXCEPTION\n WHEN duplicate_object THEN null;\nEND $$;\n"]))))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.up = up;
;
function down(_a) {
    var payload = _a.payload;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, payload.db.drizzle.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\nDROP TABLE \"subscriptions_rels\";\nDROP TABLE \"subscription_groups\";"], ["\n\nDROP TABLE \"subscriptions_rels\";\nDROP TABLE \"subscription_groups\";"]))))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.down = down;
;
var templateObject_1, templateObject_2;
