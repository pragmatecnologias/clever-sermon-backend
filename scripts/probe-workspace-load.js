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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var dotenv_1 = require("dotenv");
var typeorm_config_1 = require("../src/config/typeorm.config");
var sermon_workspace_entity_1 = require("../src/entities/sermon-workspace.entity");
(0, dotenv_1.config)();
var workspaceId = process.env.WORKSPACE_ID || '0ceaeb20-a88c-42ba-85c9-ad182d76865d';
var relations = (process.env.RELATIONS || 'outlines,manuscripts,applications,illustrations,discussionQuestions,citations,dnaAnalyses,studyReports')
    .split(',')
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var workspace;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, typeorm_config_1.default.initialize()];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, typeorm_config_1.default.getRepository(sermon_workspace_entity_1.SermonWorkspace).findOne({
                            where: { id: workspaceId },
                            relations: relations,
                        })];
                case 2:
                    workspace = _m.sent();
                    if (!!workspace) return [3 /*break*/, 4];
                    console.log(JSON.stringify({ workspaceId: workspaceId, found: false }));
                    return [4 /*yield*/, typeorm_config_1.default.destroy()];
                case 3:
                    _m.sent();
                    return [2 /*return*/];
                case 4:
                    console.log(JSON.stringify({
                        workspaceId: workspaceId,
                        relations: relations,
                        found: true,
                        counts: {
                            outlines: ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.length) || 0,
                            manuscripts: ((_b = workspace.manuscripts) === null || _b === void 0 ? void 0 : _b.length) || 0,
                            applications: ((_c = workspace.applications) === null || _c === void 0 ? void 0 : _c.length) || 0,
                            illustrations: ((_d = workspace.illustrations) === null || _d === void 0 ? void 0 : _d.length) || 0,
                            discussionQuestions: ((_e = workspace.discussionQuestions) === null || _e === void 0 ? void 0 : _e.length) || 0,
                            citations: ((_f = workspace.citations) === null || _f === void 0 ? void 0 : _f.length) || 0,
                            dnaAnalyses: ((_g = workspace.dnaAnalyses) === null || _g === void 0 ? void 0 : _g.length) || 0,
                            studyReports: ((_h = workspace.studyReports) === null || _h === void 0 ? void 0 : _h.length) || 0,
                        },
                        hasWorkspaceBackrefs: Boolean(((_j = workspace.outlines) === null || _j === void 0 ? void 0 : _j.some(function (item) { return Boolean(item === null || item === void 0 ? void 0 : item.workspace); })) ||
                            ((_k = workspace.manuscripts) === null || _k === void 0 ? void 0 : _k.some(function (item) { return Boolean(item === null || item === void 0 ? void 0 : item.workspace); })) ||
                            ((_l = workspace.studyReports) === null || _l === void 0 ? void 0 : _l.some(function (item) { return Boolean(item === null || item === void 0 ? void 0 : item.workspace); }))),
                    }, null, 2));
                    return [4 /*yield*/, typeorm_config_1.default.destroy()];
                case 5:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error(error);
    process.exit(1);
});
