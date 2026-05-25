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
exports.User = exports.UserRole = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var note_entity_1 = require("./note.entity");
var highlight_entity_1 = require("./highlight.entity");
var word_study_entity_1 = require("./word-study.entity");
var knowledge_content_entity_1 = require("./knowledge-content.entity");
var topic_graph_node_entity_1 = require("./topic-graph-node.entity");
var ai_conversation_entity_1 = require("./ai-conversation.entity");
var llm_request_entity_1 = require("./llm-request.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var User = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _passwordHash_decorators;
    var _passwordHash_initializers = [];
    var _passwordHash_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _preferences_decorators;
    var _preferences_initializers = [];
    var _preferences_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _workspaces_decorators;
    var _workspaces_initializers = [];
    var _workspaces_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _highlights_decorators;
    var _highlights_initializers = [];
    var _highlights_extraInitializers = [];
    var _wordStudies_decorators;
    var _wordStudies_initializers = [];
    var _wordStudies_extraInitializers = [];
    var _knowledgeContent_decorators;
    var _knowledgeContent_initializers = [];
    var _knowledgeContent_extraInitializers = [];
    var _topicNodes_decorators;
    var _topicNodes_initializers = [];
    var _topicNodes_extraInitializers = [];
    var _aiConversations_decorators;
    var _aiConversations_initializers = [];
    var _aiConversations_extraInitializers = [];
    var _llmRequests_decorators;
    var _llmRequests_initializers = [];
    var _llmRequests_extraInitializers = [];
    var User = _classThis = /** @class */ (function () {
        function User_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.email = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.passwordHash = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _passwordHash_initializers, void 0));
            this.role = (__runInitializers(this, _passwordHash_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.firstName = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
            this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
            this.preferences = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _preferences_initializers, void 0));
            this.createdAt = (__runInitializers(this, _preferences_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.workspaces = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _workspaces_initializers, void 0));
            this.notes = (__runInitializers(this, _workspaces_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.highlights = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _highlights_initializers, void 0));
            this.wordStudies = (__runInitializers(this, _highlights_extraInitializers), __runInitializers(this, _wordStudies_initializers, void 0));
            this.knowledgeContent = (__runInitializers(this, _wordStudies_extraInitializers), __runInitializers(this, _knowledgeContent_initializers, void 0));
            this.topicNodes = (__runInitializers(this, _knowledgeContent_extraInitializers), __runInitializers(this, _topicNodes_initializers, void 0));
            this.aiConversations = (__runInitializers(this, _topicNodes_extraInitializers), __runInitializers(this, _aiConversations_initializers, void 0));
            this.llmRequests = (__runInitializers(this, _aiConversations_extraInitializers), __runInitializers(this, _llmRequests_initializers, void 0));
            __runInitializers(this, _llmRequests_extraInitializers);
        }
        return User_1;
    }());
    __setFunctionName(_classThis, "User");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _email_decorators = [(0, typeorm_1.Column)({ type: 'text', unique: true })];
        _passwordHash_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _role_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })];
        _firstName_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _lastName_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _preferences_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' })];
        _workspaces_decorators = [(0, typeorm_1.OneToMany)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.user; })];
        _notes_decorators = [(0, typeorm_1.OneToMany)(function () { return note_entity_1.Note; }, function (note) { return note.user; })];
        _highlights_decorators = [(0, typeorm_1.OneToMany)(function () { return highlight_entity_1.Highlight; }, function (highlight) { return highlight.user; })];
        _wordStudies_decorators = [(0, typeorm_1.OneToMany)(function () { return word_study_entity_1.WordStudy; }, function (wordStudy) { return wordStudy.user; })];
        _knowledgeContent_decorators = [(0, typeorm_1.OneToMany)(function () { return knowledge_content_entity_1.KnowledgeContent; }, function (content) { return content.user; })];
        _topicNodes_decorators = [(0, typeorm_1.OneToMany)(function () { return topic_graph_node_entity_1.TopicGraphNode; }, function (node) { return node.user; })];
        _aiConversations_decorators = [(0, typeorm_1.OneToMany)(function () { return ai_conversation_entity_1.AiConversation; }, function (conversation) { return conversation.user; })];
        _llmRequests_decorators = [(0, typeorm_1.OneToMany)(function () { return llm_request_entity_1.LlmRequest; }, function (request) { return request.user; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _passwordHash_decorators, { kind: "field", name: "passwordHash", static: false, private: false, access: { has: function (obj) { return "passwordHash" in obj; }, get: function (obj) { return obj.passwordHash; }, set: function (obj, value) { obj.passwordHash = value; } }, metadata: _metadata }, _passwordHash_initializers, _passwordHash_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
        __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
        __esDecorate(null, null, _preferences_decorators, { kind: "field", name: "preferences", static: false, private: false, access: { has: function (obj) { return "preferences" in obj; }, get: function (obj) { return obj.preferences; }, set: function (obj, value) { obj.preferences = value; } }, metadata: _metadata }, _preferences_initializers, _preferences_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _workspaces_decorators, { kind: "field", name: "workspaces", static: false, private: false, access: { has: function (obj) { return "workspaces" in obj; }, get: function (obj) { return obj.workspaces; }, set: function (obj, value) { obj.workspaces = value; } }, metadata: _metadata }, _workspaces_initializers, _workspaces_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _highlights_decorators, { kind: "field", name: "highlights", static: false, private: false, access: { has: function (obj) { return "highlights" in obj; }, get: function (obj) { return obj.highlights; }, set: function (obj, value) { obj.highlights = value; } }, metadata: _metadata }, _highlights_initializers, _highlights_extraInitializers);
        __esDecorate(null, null, _wordStudies_decorators, { kind: "field", name: "wordStudies", static: false, private: false, access: { has: function (obj) { return "wordStudies" in obj; }, get: function (obj) { return obj.wordStudies; }, set: function (obj, value) { obj.wordStudies = value; } }, metadata: _metadata }, _wordStudies_initializers, _wordStudies_extraInitializers);
        __esDecorate(null, null, _knowledgeContent_decorators, { kind: "field", name: "knowledgeContent", static: false, private: false, access: { has: function (obj) { return "knowledgeContent" in obj; }, get: function (obj) { return obj.knowledgeContent; }, set: function (obj, value) { obj.knowledgeContent = value; } }, metadata: _metadata }, _knowledgeContent_initializers, _knowledgeContent_extraInitializers);
        __esDecorate(null, null, _topicNodes_decorators, { kind: "field", name: "topicNodes", static: false, private: false, access: { has: function (obj) { return "topicNodes" in obj; }, get: function (obj) { return obj.topicNodes; }, set: function (obj, value) { obj.topicNodes = value; } }, metadata: _metadata }, _topicNodes_initializers, _topicNodes_extraInitializers);
        __esDecorate(null, null, _aiConversations_decorators, { kind: "field", name: "aiConversations", static: false, private: false, access: { has: function (obj) { return "aiConversations" in obj; }, get: function (obj) { return obj.aiConversations; }, set: function (obj, value) { obj.aiConversations = value; } }, metadata: _metadata }, _aiConversations_initializers, _aiConversations_extraInitializers);
        __esDecorate(null, null, _llmRequests_decorators, { kind: "field", name: "llmRequests", static: false, private: false, access: { has: function (obj) { return "llmRequests" in obj; }, get: function (obj) { return obj.llmRequests; }, set: function (obj, value) { obj.llmRequests = value; } }, metadata: _metadata }, _llmRequests_initializers, _llmRequests_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
}();
exports.User = User;
