"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceGenerationService = void 0;
var common_1 = require("@nestjs/common");
var workspace_generation_registry_1 = require("./workspace-generation.registry");
var WorkspaceGenerationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkspaceGenerationService = _classThis = /** @class */ (function () {
        function WorkspaceGenerationService_1(workspaceGenerationQueue, manuscriptRepairQueue, workspacesService) {
            this.workspaceGenerationQueue = workspaceGenerationQueue;
            this.manuscriptRepairQueue = manuscriptRepairQueue;
            this.workspacesService = workspacesService;
        }
        WorkspaceGenerationService_1.prototype.queueWorkspaceGeneration = function (workspaceId_1, userId_1, capability_1, promptOverride_1) {
            return __awaiter(this, arguments, void 0, function (workspaceId, userId, capability, promptOverride, includeEGW) {
                var job;
                if (includeEGW === void 0) { includeEGW = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceGenerationQueue.add('generate', {
                                workspaceId: workspaceId,
                                userId: userId,
                                capability: capability,
                                promptOverride: promptOverride,
                                includeEGW: includeEGW,
                            }, {
                                attempts: 2,
                                removeOnComplete: 50,
                                removeOnFail: 50,
                            })];
                        case 1:
                            job = _a.sent();
                            return [2 /*return*/, {
                                    jobId: String(job.id),
                                    status: 'queued',
                                    workspaceId: workspaceId,
                                    capability: capability,
                                }];
                    }
                });
            });
        };
        WorkspaceGenerationService_1.prototype.getWorkspaceGenerationJobStatus = function (workspaceId, jobId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, data, state, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceGenerationQueue.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                throw new common_1.BadRequestException('Generation job not found.');
                            }
                            data = (job.data || {});
                            if (data.workspaceId !== workspaceId || data.userId !== userId) {
                                throw new common_1.BadRequestException('Generation job does not belong to this workspace.');
                            }
                            return [4 /*yield*/, job.getState()];
                        case 2:
                            state = _a.sent();
                            progress = (job.progress() || {});
                            if (state === 'completed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'completed',
                                        state: 'completed',
                                        result: job.returnvalue || null,
                                    }];
                            }
                            if (state === 'failed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'failed',
                                        state: 'failed',
                                        error: job.failedReason || 'Generation job failed.',
                                    }];
                            }
                            return [2 /*return*/, {
                                    jobId: jobId,
                                    status: state === 'active' ? (progress.state || 'running') : 'queued',
                                    state: progress.state || (state === 'active' ? 'running' : 'queued'),
                                    message: progress.message || '',
                                }];
                    }
                });
            });
        };
        WorkspaceGenerationService_1.prototype.enqueueManuscriptRepair = function (workspaceId, manuscriptId, userId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manuscriptRepairQueue.add('repair', {
                                workspaceId: workspaceId,
                                manuscriptId: manuscriptId,
                                userId: userId,
                                selectedIssueIds: payload.selectedIssueIds || [],
                                doNotTouchAnchors: payload.doNotTouchAnchors || [],
                                conversationSummary: payload.conversationSummary || '',
                                mode: 'targeted',
                            }, {
                                attempts: 2,
                                removeOnComplete: 50,
                                removeOnFail: 50,
                            })];
                        case 1:
                            job = _a.sent();
                            return [2 /*return*/, {
                                    jobId: String(job.id),
                                    status: 'queued',
                                    manuscriptId: manuscriptId,
                                }];
                    }
                });
            });
        };
        WorkspaceGenerationService_1.prototype.getManuscriptRepairJobStatus = function (workspaceId, manuscriptId, jobId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, data, state, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manuscriptRepairQueue.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job) {
                                throw new common_1.BadRequestException('Repair job not found.');
                            }
                            data = (job.data || {});
                            if (data.workspaceId !== workspaceId || data.manuscriptId !== manuscriptId || data.userId !== userId) {
                                throw new common_1.BadRequestException('Repair job does not belong to this manuscript.');
                            }
                            return [4 /*yield*/, job.getState()];
                        case 2:
                            state = _a.sent();
                            progress = (job.progress() || {});
                            if (state === 'completed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'completed',
                                        state: 'completed',
                                        result: job.returnvalue || null,
                                    }];
                            }
                            if (state === 'failed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'failed',
                                        state: 'failed',
                                        error: job.failedReason || 'Repair job failed.',
                                    }];
                            }
                            return [2 /*return*/, {
                                    jobId: jobId,
                                    status: state === 'active' ? (progress.state || 'patching') : 'queued',
                                    state: progress.state || (state === 'active' ? 'patching' : 'queued'),
                                    message: progress.message || '',
                                    touchedAnchors: progress.touchedAnchors || [],
                                }];
                    }
                });
            });
        };
        WorkspaceGenerationService_1.prototype.validateGenerationResult = function (capability, parsed) {
            var registryEntry = workspace_generation_registry_1.WorkspaceGenerationRegistry[capability];
            var validation = registryEntry.validate(parsed);
            if (!validation.ok) {
                throw new common_1.BadRequestException("".concat(registryEntry.description, " validation failed: ").concat(validation.issues.join('; ')));
            }
            return validation;
        };
        WorkspaceGenerationService_1.prototype.processWorkspaceGenerationJob = function (payload, job) {
            return __awaiter(this, void 0, void 0, function () {
                var setStage, report, result, _a, workspace, selectedOutline, result, result, result, result, result, result, result, result;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setStage = function (state, message) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!job) return [3 /*break*/, 2];
                                            return [4 /*yield*/, job.progress({ state: state, message: message })];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, setStage('loading', 'Loading workspace.')];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.findOne(payload.workspaceId, payload.userId)];
                        case 2:
                            _c.sent();
                            if (!(payload.capability === 'study-report')) return [3 /*break*/, 6];
                            return [4 /*yield*/, setStage('study-report', 'Generating study report.')];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateStudyReport(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 4:
                            report = _c.sent();
                            this.validateGenerationResult('study-report', (report === null || report === void 0 ? void 0 : report.sections) || report);
                            return [4 /*yield*/, setStage('completed', 'Study report completed.')];
                        case 5:
                            _c.sent();
                            return [2 /*return*/, report];
                        case 6:
                            if (!(payload.capability === 'outline-points' || payload.capability === 'outline')) return [3 /*break*/, 13];
                            return [4 /*yield*/, setStage('outline', 'Generating outlines.')];
                        case 7:
                            _c.sent();
                            if (!(payload.capability === 'outline-points')) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.workspacesService.generateOutlines(payload.workspaceId, payload.userId, 1, payload.promptOverride)];
                        case 8:
                            _a = _c.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.workspacesService.generateOutlines(payload.workspaceId, payload.userId, 1, payload.promptOverride)];
                        case 10:
                            _a = _c.sent();
                            _c.label = 11;
                        case 11:
                            result = _a;
                            if (payload.capability === 'outline-points') {
                                this.validateGenerationResult('outline-points', result.map(function (outline) {
                                    var _a, _b;
                                    return ({
                                        points: ((_a = outline.structure) === null || _a === void 0 ? void 0 : _a.points) || ((_b = outline.structure) === null || _b === void 0 ? void 0 : _b.pointNodes) || [],
                                        angle: outline.title,
                                    });
                                }));
                            }
                            else {
                                this.validateGenerationResult('outline', ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.structure) || {});
                            }
                            return [4 /*yield*/, setStage('completed', 'Outline generation completed.')];
                        case 12:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 13:
                            if (!(payload.capability === 'manuscript')) return [3 /*break*/, 18];
                            return [4 /*yield*/, setStage('manuscript', 'Generating manuscript.')];
                        case 14:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.findOne(payload.workspaceId, payload.userId)];
                        case 15:
                            workspace = _c.sent();
                            selectedOutline = (workspace.outlines || []).find(function (outline) { return outline === null || outline === void 0 ? void 0 : outline.isSelected; }) ||
                                (workspace.outlines || [])[0];
                            if (!(selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.id)) {
                                throw new common_1.BadRequestException('No selected outline found for manuscript generation.');
                            }
                            return [4 /*yield*/, this.workspacesService.generateManuscript(payload.workspaceId, selectedOutline.id, payload.userId, payload.promptOverride)];
                        case 16:
                            result = _c.sent();
                            this.validateGenerationResult('manuscript', result);
                            return [4 /*yield*/, setStage('completed', 'Manuscript generation completed.')];
                        case 17:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 18:
                            if (!(payload.capability === 'sermon-core')) return [3 /*break*/, 22];
                            return [4 /*yield*/, setStage('sermon-core', 'Generating sermon core.')];
                        case 19:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateSermonCore(payload.workspaceId, payload.userId)];
                        case 20:
                            result = _c.sent();
                            this.validateGenerationResult('sermon-core', result);
                            return [4 /*yield*/, setStage('completed', 'Sermon core completed.')];
                        case 21:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 22:
                            if (!(payload.capability === 'integrity-check')) return [3 /*break*/, 26];
                            return [4 /*yield*/, setStage('integrity-check', 'Running integrity review.')];
                        case 23:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.runIntegrityCheck(payload.workspaceId, payload.userId)];
                        case 24:
                            result = _c.sent();
                            this.validateGenerationResult('integrity-check', result);
                            return [4 /*yield*/, setStage('completed', 'Integrity review completed.')];
                        case 25:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 26:
                            if (!(payload.capability === 'applications')) return [3 /*break*/, 30];
                            return [4 /*yield*/, setStage('applications', 'Generating applications.')];
                        case 27:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateApplications(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 28:
                            result = _c.sent();
                            this.validateGenerationResult('applications', result);
                            return [4 /*yield*/, setStage('completed', 'Applications completed.')];
                        case 29:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 30:
                            if (!(payload.capability === 'discussion-questions')) return [3 /*break*/, 34];
                            return [4 /*yield*/, setStage('discussion-questions', 'Generating discussion questions.')];
                        case 31:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateDiscussionQuestions(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 32:
                            result = _c.sent();
                            this.validateGenerationResult('discussion-questions', result);
                            return [4 /*yield*/, setStage('completed', 'Discussion questions completed.')];
                        case 33:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 34:
                            if (!(payload.capability === 'illustrations')) return [3 /*break*/, 38];
                            return [4 /*yield*/, setStage('illustrations', 'Generating illustration ideas.')];
                        case 35:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateIllustrations(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 36:
                            result = _c.sent();
                            this.validateGenerationResult('illustrations', result);
                            return [4 /*yield*/, setStage('completed', 'Illustrations completed.')];
                        case 37:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 38:
                            if (!(payload.capability === 'citations')) return [3 /*break*/, 42];
                            return [4 /*yield*/, setStage('citations', 'Generating citations.')];
                        case 39:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateCitations(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 40:
                            result = _c.sent();
                            this.validateGenerationResult('citations', result);
                            return [4 /*yield*/, setStage('completed', 'Citations completed.')];
                        case 41:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 42:
                            if (!(payload.capability === 'media-suggestions')) return [3 /*break*/, 46];
                            return [4 /*yield*/, setStage('media-suggestions', 'Generating media suggestions.')];
                        case 43:
                            _c.sent();
                            return [4 /*yield*/, this.workspacesService.generateMediaSuggestions(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 44:
                            result = _c.sent();
                            this.validateGenerationResult('media-suggestions', result);
                            return [4 /*yield*/, setStage('completed', 'Media suggestions completed.')];
                        case 45:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 46: return [4 /*yield*/, setStage('failed', "Unsupported capability: ".concat(payload.capability))];
                        case 47:
                            _c.sent();
                            throw new common_1.BadRequestException("Unsupported generation capability: ".concat(payload.capability));
                    }
                });
            });
        };
        WorkspaceGenerationService_1.prototype.processManuscriptRepairJob = function (payload, job) {
            return __awaiter(this, void 0, void 0, function () {
                var setStage, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setStage = function (state_1, message_1) {
                                var args_1 = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    args_1[_i - 2] = arguments[_i];
                                }
                                return __awaiter(_this, __spreadArray([state_1, message_1], args_1, true), void 0, function (state, message, touchedAnchors) {
                                    if (touchedAnchors === void 0) { touchedAnchors = []; }
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!job) return [3 /*break*/, 2];
                                                return [4 /*yield*/, job.progress({ state: state, message: message, touchedAnchors: touchedAnchors })];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                console.info('[manuscript-repair]', JSON.stringify({
                                                    tag: 'manuscript_repair_stage',
                                                    workspaceId: payload.workspaceId,
                                                    manuscriptId: payload.manuscriptId,
                                                    state: state,
                                                    message: message,
                                                    touchedAnchors: touchedAnchors,
                                                }));
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            return [4 /*yield*/, setStage('planning', 'Preparing targeted repair plan.')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.workspacesService.applyTargetedManuscriptRepair(payload, setStage)];
                        case 2:
                            result = _a.sent();
                            return [4 /*yield*/, setStage('completed', 'Targeted repair completed.', (result === null || result === void 0 ? void 0 : result.touchedAnchors) || [])];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return WorkspaceGenerationService_1;
    }());
    __setFunctionName(_classThis, "WorkspaceGenerationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspaceGenerationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspaceGenerationService = _classThis;
}();
exports.WorkspaceGenerationService = WorkspaceGenerationService;
