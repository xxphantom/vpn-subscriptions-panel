"use strict";
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
exports.Subscriptions = void 0;
var sanitize_url_1 = require("../../shared/sanitize-url");
var uuid_1 = require("uuid");
exports.Subscriptions = {
    slug: "subscriptions",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "group", "createdAt"],
        group: "VPN",
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
    ],
    hooks: {
        afterChange: [
            function (_a) {
                var req = _a.req, doc = _a.doc, previousDoc = _a.previousDoc;
                return __awaiter(void 0, void 0, void 0, function () {
                    var newGroupId, oldGroupId;
                    return __generator(this, function (_b) {
                        newGroupId = doc.group;
                        oldGroupId = previousDoc === null || previousDoc === void 0 ? void 0 : previousDoc.group;
                        // Вызываем пересчет в следующем «тике» Event Loop,
                        setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        if (!oldGroupId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, recalcSubscriptionCount({
                                                req: req,
                                                groupId: oldGroupId,
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (!newGroupId) return [3 /*break*/, 4];
                                        return [4 /*yield*/, recalcSubscriptionCount({
                                                req: req,
                                                groupId: newGroupId,
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        err_1 = _a.sent();
                                        console.error("Ошибка при пересчете подписок:", err_1);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, doc];
                    });
                });
            },
        ],
        afterDelete: [
            function (_a) {
                var req = _a.req, doc = _a.doc;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        try {
                            if (doc === null || doc === void 0 ? void 0 : doc.group) {
                                setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, recalcSubscriptionCount({
                                                    req: req,
                                                    groupId: doc.group,
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            }
                            return [2 /*return*/, doc];
                        }
                        catch (error) {
                            console.error("Ошибка при удалении подписки:", error);
                            return [2 /*return*/, doc];
                        }
                        return [2 /*return*/];
                    });
                });
            },
        ],
    },
};
// Вспомогательный метод, который считает подписки и обновляет group.subscriptionCount:
function recalcSubscriptionCount(_a) {
    var req = _a.req, groupId = _a.groupId;
    return __awaiter(this, void 0, void 0, function () {
        var actualGroupId, group, subscriptionsResult, count, result, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!groupId) {
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    actualGroupId = typeof groupId === "object" ? groupId.id : groupId;
                    if (typeof actualGroupId !== "number" &&
                        typeof actualGroupId !== "string") {
                        throw new Error("Invalid groupId type: ".concat(typeof actualGroupId, ". Expected number or string."));
                    }
                    return [4 /*yield*/, req.payload.findByID({
                            collection: "subscription-groups",
                            id: actualGroupId,
                        })];
                case 2:
                    group = _b.sent();
                    if (!group) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, req.payload.find({
                            collection: "subscriptions",
                            where: {
                                group: {
                                    equals: actualGroupId,
                                },
                            },
                            depth: 0,
                            limit: 0,
                        })];
                case 3:
                    subscriptionsResult = _b.sent();
                    count = subscriptionsResult.totalDocs;
                    return [4 /*yield*/, req.payload.update({
                            collection: "subscription-groups",
                            id: actualGroupId,
                            data: {
                                subscriptionCount: count,
                            },
                            depth: 0,
                        })];
                case 4:
                    result = _b.sent();
                    return [2 /*return*/, count];
                case 5:
                    e_1 = _b.sent();
                    console.error("Ошибка при пересчете подписок:", e_1);
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
