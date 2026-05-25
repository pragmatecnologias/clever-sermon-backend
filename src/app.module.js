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
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var bull_1 = require("@nestjs/bull");
var auth_module_1 = require("./modules/auth/auth.module");
var workspaces_module_1 = require("./modules/workspaces/workspaces.module");
var scripture_module_1 = require("./modules/scripture/scripture.module");
var llm_module_1 = require("./modules/llm/llm.module");
var notes_module_1 = require("./modules/notes/notes.module");
var highlights_module_1 = require("./modules/highlights/highlights.module");
var word_study_module_1 = require("./modules/word-study/word-study.module");
var cross_references_module_1 = require("./modules/cross-references/cross-references.module");
var knowledge_module_1 = require("./modules/knowledge/knowledge.module");
var topic_graph_module_1 = require("./modules/topic-graph/topic-graph.module");
var ai_companion_module_1 = require("./modules/ai-companion/ai-companion.module");
var sermon_dna_module_1 = require("./modules/sermon-dna/sermon-dna.module");
var search_module_1 = require("./modules/search/search.module");
var visualization_module_1 = require("./modules/visualization/visualization.module");
var egw_module_1 = require("./modules/egw/egw.module");
var analysis_module_1 = require("./modules/analysis/analysis.module");
var church_settings_module_1 = require("./modules/church-settings/church-settings.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: function (configService) {
                        var baseUrl = configService.get('DATABASE_URL');
                        var databaseName = configService.get('DATABASE_NAME');
                        var hasPath = baseUrl && new URL(baseUrl).pathname && new URL(baseUrl).pathname !== '/';
                        var url = baseUrl && databaseName && !hasPath ? "".concat(baseUrl.replace(/\/$/, ''), "/").concat(databaseName) : baseUrl;
                        // When using url, TypeORM parses credentials from it - don't duplicate
                        var useUrl = configService.get('DATABASE_URL') ? true : false;
                        return {
                            type: 'postgres',
                            url: useUrl ? url : undefined,
                            host: useUrl ? undefined : (configService.get('DATABASE_HOST') || 'localhost'),
                            port: useUrl ? undefined : parseInt(configService.get('DATABASE_PORT') || '5432', 10),
                            username: useUrl ? undefined : (configService.get('DATABASE_USER') || 'admin'),
                            password: useUrl ? undefined : configService.get('DATABASE_PASSWORD'),
                            database: useUrl ? undefined : databaseName,
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: configService.get('TYPEORM_SYNC') === 'true',
                        };
                    },
                }),
                bull_1.BullModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: function (configService) { return ({
                        redis: {
                            host: configService.get('REDIS_HOST') || 'localhost',
                            port: configService.get('REDIS_PORT') || 6379,
                        },
                    }); },
                }),
                auth_module_1.AuthModule,
                workspaces_module_1.WorkspacesModule,
                scripture_module_1.ScriptureModule,
                llm_module_1.LlmModule,
                notes_module_1.NotesModule,
                highlights_module_1.HighlightsModule,
                word_study_module_1.WordStudyModule,
                cross_references_module_1.CrossReferencesModule,
                knowledge_module_1.KnowledgeModule,
                topic_graph_module_1.TopicGraphModule,
                ai_companion_module_1.AiCompanionModule,
                sermon_dna_module_1.SermonDnaModule,
                search_module_1.SearchModule,
                visualization_module_1.VisualizationModule,
                egw_module_1.EGWModule,
                analysis_module_1.AnalysisModule,
                church_settings_module_1.ChurchSettingsModule,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
