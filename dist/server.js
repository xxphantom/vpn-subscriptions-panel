"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var payload_1 = __importDefault(require("payload"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dateUtils_1 = require("./shared/dateUtils");
var subscription_1 = require("./templates/subscription");
var DEFAULT_PORT = 3000;
require("dotenv").config();
var app = (0, express_1.default)();
app.get("/", function (_, res) {
    res.redirect("/admin");
});
app.get("/subscription/:name/:slug", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var globalConfig, slug, subscription, sub, group, configOverrides, config, acceptHeader, html, lines, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, payload_1.default.findGlobal({
                        slug: "shared-config",
                    })];
            case 1:
                globalConfig = _b.sent();
                slug = req.params.slug;
                return [4 /*yield*/, payload_1.default.find({
                        collection: "subscriptions",
                        where: {
                            slug: {
                                equals: slug,
                            },
                        },
                        depth: 1, // Получаем данные связанной группы
                    })];
            case 2:
                subscription = _b.sent();
                if (!((_a = subscription === null || subscription === void 0 ? void 0 : subscription.docs) === null || _a === void 0 ? void 0 : _a[0])) {
                    return [2 /*return*/, res.status(404).send("Подписка не найдена")];
                }
                sub = subscription.docs[0];
                group = "group" in sub && typeof sub.group === "object"
                    ? sub.group
                    : {};
                configOverrides = ("configOverrides" in group && group.configOverrides) ||
                    {};
                config = {
                    links: sub.links,
                    expire: sub.expire,
                    vpn_name: String(configOverrides.vpn_name || globalConfig.vpn_name),
                    config_update_hours: String(configOverrides.config_update_hours || globalConfig.config_update_hours),
                    support_chat_link: String(configOverrides.support_chat_link || globalConfig.support_chat_link),
                    site_link: String(configOverrides.site_link || globalConfig.site_link),
                    announce: String(configOverrides.announce || globalConfig.announce),
                };
                acceptHeader = req.get("Accept");
                if (acceptHeader && acceptHeader.includes("text/html")) {
                    html = (0, subscription_1.renderSubscriptionTemplate)(__assign(__assign({}, config), { subscriptionUrl: sub.subscriptionUrl }));
                    return [2 /*return*/, res.send(html)];
                }
                lines = __spreadArray([
                    "#profile-title: ".concat(config.vpn_name),
                    "#profile-update-interval: ".concat(config.config_update_hours),
                    "#subscription-userinfo: expire=".concat((0, dateUtils_1.dateToUnixTimestamp)(config.expire)),
                    "#support-url: ".concat(config.support_chat_link),
                    "#profile-web-page-url: ".concat(config.site_link),
                    "#announce: ".concat(config.announce)
                ], config.links.map(function (obj) { return obj.url; }), true);
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.send(lines.join("\n"));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).send("Ошибка сервера");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var isDev, sslOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Initialize Payload
                return [4 /*yield*/, payload_1.default.init({
                        secret: process.env.PAYLOAD_SECRET || "",
                        express: app,
                        onInit: function () {
                            payload_1.default.logger.info("Payload Admin URL: ".concat(payload_1.default.getAdminURL()));
                        },
                    })];
                case 1:
                    // Initialize Payload
                    _a.sent();
                    isDev = process.env.NODE_ENV === "development";
                    if (isDev) {
                        // В режиме разработки используем HTTP
                        app.listen(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT, function () {
                            console.log("Server running on http://localhost:".concat(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT));
                        });
                    }
                    else {
                        sslOptions = {
                            key: fs_1.default.readFileSync(path_1.default.resolve(process.env.SSL_KEY_PATH || "ssl/private.key")),
                            cert: fs_1.default.readFileSync(path_1.default.resolve(process.env.SSL_CERT_PATH || "ssl/certificate.crt")),
                        };
                        https_1.default
                            .createServer(sslOptions, app)
                            .listen(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT, function () {
                            console.log("Secure server running on https://".concat(process.env.SUBSCRIPTIONS_DOMAIN_URL || "localhost", ":").concat(process.env.SUBSCRIPTIONS_DOMAIN_PORT || DEFAULT_PORT));
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
start();
