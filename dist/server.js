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
// backend/src/server.ts
var express_1 = __importDefault(require("express"));
var payload_1 = __importDefault(require("payload"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dateUtils_1 = require("./shared/dateUtils");
var DEFAULT_PORT = 3000;
require("dotenv").config();
var app = (0, express_1.default)();
app.get("/", function (_, res) {
    res.redirect("/admin");
});
app.get("/subscription/:name/:slug", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var globalConfig, slug, subscription, sub, config, lines, error_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                _m.trys.push([0, 3, , 4]);
                return [4 /*yield*/, payload_1.default.findGlobal({
                        slug: "shared-config",
                    })];
            case 1:
                globalConfig = _m.sent();
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
                subscription = _m.sent();
                if (!((_a = subscription === null || subscription === void 0 ? void 0 : subscription.docs) === null || _a === void 0 ? void 0 : _a[0])) {
                    return [2 /*return*/, res.status(404).send("Подписка не найдена")];
                }
                sub = subscription.docs[0];
                config = {
                    vpn_name: ((_c = (_b = sub.group) === null || _b === void 0 ? void 0 : _b.configOverrides) === null || _c === void 0 ? void 0 : _c.vpn_name) || globalConfig.vpn_name,
                    config_update_hours: ((_e = (_d = sub.group) === null || _d === void 0 ? void 0 : _d.configOverrides) === null || _e === void 0 ? void 0 : _e.config_update_hours) || globalConfig.config_update_hours,
                    support_chat_link: ((_g = (_f = sub.group) === null || _f === void 0 ? void 0 : _f.configOverrides) === null || _g === void 0 ? void 0 : _g.support_chat_link) || globalConfig.support_chat_link,
                    site_link: ((_j = (_h = sub.group) === null || _h === void 0 ? void 0 : _h.configOverrides) === null || _j === void 0 ? void 0 : _j.site_link) || globalConfig.site_link,
                    announce: ((_l = (_k = sub.group) === null || _k === void 0 ? void 0 : _k.configOverrides) === null || _l === void 0 ? void 0 : _l.announce) || globalConfig.announce,
                };
                lines = __spreadArray([
                    "#profile-title: ".concat(config.vpn_name),
                    "#profile-update-interval: ".concat(config.config_update_hours),
                    "#subscription-userinfo: expire=".concat((0, dateUtils_1.dateToUnixTimestamp)(sub.expire)),
                    "#support-url: ".concat(config.support_chat_link),
                    "#profile-web-page-url: ".concat(config.site_link),
                    "#announce: ".concat(config.announce)
                ], sub.links.map(function (obj) { return obj.url; }), true);
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.send(lines.join("\n"));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _m.sent();
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
