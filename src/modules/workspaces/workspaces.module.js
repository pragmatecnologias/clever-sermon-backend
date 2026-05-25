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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bull_1 = require("@nestjs/bull");
var workspaces_service_1 = require("./workspaces.service");
var workspaces_controller_1 = require("./workspaces.controller");
var content_validator_service_1 = require("./content-validator.service");
var sermon_integrity_service_1 = require("./sermon-integrity.service");
var workspace_state_service_1 = require("./workspace-state.service");
var workspace_generation_service_1 = require("./workspace-generation.service");
var workspace_trust_service_1 = require("./workspace-trust.service");
var workspace_media_pack_service_1 = require("./workspace-media-pack.service");
var media_proxy_controller_1 = require("./media-proxy.controller");
var manuscript_repair_processor_1 = require("./manuscript-repair.processor");
var workspace_generation_processor_1 = require("./workspace-generation.processor");
var sermon_workspace_entity_1 = require("../../entities/sermon-workspace.entity");
var sermon_outline_entity_1 = require("../../entities/sermon-outline.entity");
var sermon_manuscript_entity_1 = require("../../entities/sermon-manuscript.entity");
var sermon_application_entity_1 = require("../../entities/sermon-application.entity");
var sermon_illustration_entity_1 = require("../../entities/sermon-illustration.entity");
var discussion_question_entity_1 = require("../../entities/discussion-question.entity");
var sermon_citation_entity_1 = require("../../entities/sermon-citation.entity");
var sermon_study_report_entity_1 = require("../../entities/sermon-study-report.entity");
var llm_module_1 = require("../llm/llm.module");
var scripture_module_1 = require("../scripture/scripture.module");
var egw_module_1 = require("../egw/egw.module");
var WorkspacesModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    sermon_workspace_entity_1.SermonWorkspace,
                    sermon_outline_entity_1.SermonOutline,
                    sermon_manuscript_entity_1.SermonManuscript,
                    sermon_application_entity_1.SermonApplication,
                    sermon_illustration_entity_1.SermonIllustration,
                    discussion_question_entity_1.DiscussionQuestion,
                    sermon_citation_entity_1.SermonCitation,
                    sermon_study_report_entity_1.SermonStudyReport,
                ]),
                bull_1.BullModule.registerQueue({
                    name: 'manuscript-repair',
                }),
                bull_1.BullModule.registerQueue({
                    name: 'workspace-generation',
                }),
                llm_module_1.LlmModule,
                scripture_module_1.ScriptureModule,
                egw_module_1.EGWModule,
            ],
            providers: [
                workspaces_service_1.WorkspacesService,
                workspace_state_service_1.WorkspaceStateService,
                workspace_generation_service_1.WorkspaceGenerationService,
                workspace_trust_service_1.WorkspaceTrustService,
                workspace_media_pack_service_1.WorkspaceMediaPackService,
                content_validator_service_1.ContentValidatorService,
                sermon_integrity_service_1.SermonIntegrityService,
                manuscript_repair_processor_1.ManuscriptRepairProcessor,
                workspace_generation_processor_1.WorkspaceGenerationProcessor,
            ],
            controllers: [workspaces_controller_1.WorkspacesController, media_proxy_controller_1.MediaProxyController],
            exports: [workspaces_service_1.WorkspacesService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkspacesModule = _classThis = /** @class */ (function () {
        function WorkspacesModule_1() {
        }
        return WorkspacesModule_1;
    }());
    __setFunctionName(_classThis, "WorkspacesModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspacesModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspacesModule = _classThis;
}();
exports.WorkspacesModule = WorkspacesModule;
