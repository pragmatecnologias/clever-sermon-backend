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
exports.seed = seed;
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
var bcrypt = require("bcrypt");
var user_entity_1 = require("../entities/user.entity");
var bible_translation_entity_1 = require("../entities/bible-translation.entity");
var sermon_workspace_entity_1 = require("../entities/sermon-workspace.entity");
var sermon_outline_entity_1 = require("../entities/sermon-outline.entity");
var sermon_manuscript_entity_1 = require("../entities/sermon-manuscript.entity");
var sermon_application_entity_1 = require("../entities/sermon-application.entity");
var sermon_illustration_entity_1 = require("../entities/sermon-illustration.entity");
var discussion_question_entity_1 = require("../entities/discussion-question.entity");
var sermon_citation_entity_1 = require("../entities/sermon-citation.entity");
var note_entity_1 = require("../entities/note.entity");
var highlight_entity_1 = require("../entities/highlight.entity");
var word_study_entity_1 = require("../entities/word-study.entity");
var knowledge_content_entity_1 = require("../entities/knowledge-content.entity");
var topic_graph_node_entity_1 = require("../entities/topic-graph-node.entity");
var topic_graph_edge_entity_1 = require("../entities/topic-graph-edge.entity");
var cross_reference_entity_1 = require("../entities/cross-reference.entity");
var ai_conversation_entity_1 = require("../entities/ai-conversation.entity");
var llm_request_entity_1 = require("../entities/llm-request.entity");
var llm_provider_enum_1 = require("../entities/enums/llm-provider.enum");
var sermon_dna_analysis_entity_1 = require("../entities/sermon-dna-analysis.entity");
var church_settings_entity_1 = require("../entities/church-settings.entity");
var sermon_study_report_entity_1 = require("../entities/sermon-study-report.entity");
var theological_center_analysis_entity_1 = require("../entities/theological-center-analysis.entity");
var tension_analysis_entity_1 = require("../entities/tension-analysis.entity");
var doctrinal_precision_check_entity_1 = require("../entities/doctrinal-precision-check.entity");
var preaching_strategy_entity_1 = require("../entities/preaching-strategy.entity");
var historical_context_enhanced_entity_1 = require("../entities/historical-context-enhanced.entity");
(0, dotenv_1.config)();
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, databaseName, dbUser, dbPassword, url, parsed, dataSource, userRepository, translationRepository, workspaceRepository, outlineRepository, manuscriptRepository, applicationRepository, illustrationRepository, discussionRepository, citationRepository, noteRepository, highlightRepository, wordStudyRepository, knowledgeRepository, topicNodeRepository, topicEdgeRepository, crossReferenceRepository, aiConversationRepository, llmRequestRepository, dnaRepository, churchSettingsRepository, studyReportRepository, theologicalCenterRepository, tensionRepository, doctrinalCheckRepository, preachingStrategyRepository, historicalContextRepository, adminUser, passwordHash, churchSettings, translations, _i, translations_1, trans, existing, kjvTranslation, workspace, workspaceEs, outline, manuscript, courageNode, presenceNode, demoWorkspaceTitle, demoSeriesTitle, demoNow, demoNowIso, demoPlanning, demoMetadata, demoWorkspace, demoWorkspacePayload, demoStudyReport, demoOutline, demoManuscript;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseUrl = process.env.DATABASE_URL;
                    databaseName = process.env.DATABASE_NAME;
                    dbUser = process.env.DATABASE_USER;
                    dbPassword = process.env.DATABASE_PASSWORD;
                    url = baseUrl;
                    if (baseUrl) {
                        parsed = new URL(baseUrl);
                        if (dbUser && !parsed.username) {
                            parsed.username = dbUser;
                        }
                        if (dbPassword && !parsed.password) {
                            parsed.password = dbPassword;
                        }
                        if (databaseName && (!parsed.pathname || parsed.pathname === '/')) {
                            parsed.pathname = "/".concat(databaseName);
                        }
                        url = parsed.toString();
                    }
                    url = url || 'postgres://postgres:postgres@localhost:5432/clever_sermon';
                    dataSource = new typeorm_1.DataSource({
                        type: 'postgres',
                        url: url,
                        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    });
                    return [4 /*yield*/, dataSource.initialize()];
                case 1:
                    _a.sent();
                    userRepository = dataSource.getRepository(user_entity_1.User);
                    translationRepository = dataSource.getRepository(bible_translation_entity_1.BibleTranslation);
                    workspaceRepository = dataSource.getRepository(sermon_workspace_entity_1.SermonWorkspace);
                    outlineRepository = dataSource.getRepository(sermon_outline_entity_1.SermonOutline);
                    manuscriptRepository = dataSource.getRepository(sermon_manuscript_entity_1.SermonManuscript);
                    applicationRepository = dataSource.getRepository(sermon_application_entity_1.SermonApplication);
                    illustrationRepository = dataSource.getRepository(sermon_illustration_entity_1.SermonIllustration);
                    discussionRepository = dataSource.getRepository(discussion_question_entity_1.DiscussionQuestion);
                    citationRepository = dataSource.getRepository(sermon_citation_entity_1.SermonCitation);
                    noteRepository = dataSource.getRepository(note_entity_1.Note);
                    highlightRepository = dataSource.getRepository(highlight_entity_1.Highlight);
                    wordStudyRepository = dataSource.getRepository(word_study_entity_1.WordStudy);
                    knowledgeRepository = dataSource.getRepository(knowledge_content_entity_1.KnowledgeContent);
                    topicNodeRepository = dataSource.getRepository(topic_graph_node_entity_1.TopicGraphNode);
                    topicEdgeRepository = dataSource.getRepository(topic_graph_edge_entity_1.TopicGraphEdge);
                    crossReferenceRepository = dataSource.getRepository(cross_reference_entity_1.CrossReference);
                    aiConversationRepository = dataSource.getRepository(ai_conversation_entity_1.AiConversation);
                    llmRequestRepository = dataSource.getRepository(llm_request_entity_1.LlmRequest);
                    dnaRepository = dataSource.getRepository(sermon_dna_analysis_entity_1.SermonDnaAnalysis);
                    churchSettingsRepository = dataSource.getRepository(church_settings_entity_1.ChurchSettings);
                    studyReportRepository = dataSource.getRepository(sermon_study_report_entity_1.SermonStudyReport);
                    theologicalCenterRepository = dataSource.getRepository(theological_center_analysis_entity_1.TheologicalCenterAnalysis);
                    tensionRepository = dataSource.getRepository(tension_analysis_entity_1.TensionAnalysis);
                    doctrinalCheckRepository = dataSource.getRepository(doctrinal_precision_check_entity_1.DoctrinalPrecisionCheck);
                    preachingStrategyRepository = dataSource.getRepository(preaching_strategy_entity_1.PreachingStrategy);
                    historicalContextRepository = dataSource.getRepository(historical_context_enhanced_entity_1.HistoricalContextEnhanced);
                    return [4 /*yield*/, userRepository.findOne({ where: { email: 'admin@example.com' } })];
                case 2:
                    adminUser = _a.sent();
                    if (!!adminUser) return [3 /*break*/, 5];
                    return [4 /*yield*/, bcrypt.hash('password123', 10)];
                case 3:
                    passwordHash = _a.sent();
                    adminUser = userRepository.create({
                        email: 'admin@example.com',
                        passwordHash: passwordHash,
                        firstName: 'Admin',
                        lastName: 'User',
                        role: user_entity_1.UserRole.ADMIN,
                        preferences: {
                            dashboardLayout: 'sermon-focus',
                            highlightColor: '#F59E0B',
                        },
                    });
                    return [4 /*yield*/, userRepository.save(adminUser)];
                case 4:
                    _a.sent();
                    console.log('✅ Created admin user: admin@example.com / password123');
                    _a.label = 5;
                case 5: return [4 /*yield*/, churchSettingsRepository.findOne({ where: { userId: adminUser.id } })];
                case 6:
                    churchSettings = _a.sent();
                    if (!churchSettings) {
                        churchSettings = churchSettingsRepository.create({ userId: adminUser.id });
                    }
                    Object.assign(churchSettings, {
                        userId: adminUser.id,
                        churchName: 'Iglesia Adventista Metropolitana de Atlanta',
                        addressLine1: '5990 Oakbrook Pkwy',
                        addressLine2: null,
                        city: 'Norcross',
                        state: 'GA',
                        postalCode: '30093-1704',
                        country: 'USA',
                        phone: '770-242-5860',
                        website: 'https://atlantametropolitanhispanicga.adventistchurch.org/',
                        logoUrl: null,
                        defaultTimezone: 'America/New_York',
                    });
                    return [4 /*yield*/, churchSettingsRepository.save(churchSettings)];
                case 7:
                    _a.sent();
                    console.log('✅ Upserted church settings defaults');
                    translations = [
                        { code: 'KJV', name: 'King James Version', language: 'en', apiId: null, isPublicDomain: true },
                        { code: 'NIV', name: 'New International Version', language: 'en', apiId: null, isPublicDomain: false },
                        { code: 'ESV', name: 'English Standard Version', language: 'en', apiId: null, isPublicDomain: false },
                        { code: 'NKJV', name: 'New King James Version', language: 'en', apiId: '63097d2a0a2f7db3-01', isPublicDomain: false },
                        { code: 'NLT', name: 'New Living Translation', language: 'en', apiId: null, isPublicDomain: false },
                        { code: 'RVR1960', name: 'Reina-Valera 1960', language: 'es', apiId: '592420522e16049f-01', isPublicDomain: false },
                        { code: 'NBLA', name: 'Nueva Biblia de las Américas', language: 'es', apiId: 'ce11b813f9a27e20-01', isPublicDomain: false },
                    ];
                    _i = 0, translations_1 = translations;
                    _a.label = 8;
                case 8:
                    if (!(_i < translations_1.length)) return [3 /*break*/, 14];
                    trans = translations_1[_i];
                    return [4 /*yield*/, translationRepository.findOne({ where: { code: trans.code } })];
                case 9:
                    existing = _a.sent();
                    if (!!existing) return [3 /*break*/, 11];
                    return [4 /*yield*/, translationRepository.save(translationRepository.create(trans))];
                case 10:
                    _a.sent();
                    console.log("\u2705 Created translation: ".concat(trans.name));
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, translationRepository.update({ code: trans.code }, trans)];
                case 12:
                    _a.sent();
                    console.log("\u2705 Updated translation: ".concat(trans.name));
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 8];
                case 14: return [4 /*yield*/, translationRepository.findOne({ where: { code: 'KJV' } })];
                case 15:
                    kjvTranslation = _a.sent();
                    return [4 /*yield*/, workspaceRepository.findOne({
                            where: { userId: adminUser.id, title: 'Faith Under Fire' },
                        })];
                case 16:
                    workspace = _a.sent();
                    if (!!workspace) return [3 /*break*/, 18];
                    workspace = workspaceRepository.create({
                        userId: adminUser.id,
                        title: 'Faith Under Fire',
                        seriesTitle: 'Courageous Faith',
                        mainPassage: 'Daniel 3:13-28',
                        additionalPassages: ['Isaiah 43:2', '1 Peter 1:7'],
                        references: [
                            {
                                reference: 'Daniel 3:25',
                                context: 'Seeded reference for sermon exploration',
                                addedAt: new Date().toISOString(),
                            },
                        ],
                        theme: 'God meets us in adversity with presence and power.',
                        audienceProfile: 'Saturday worship congregation, multi-generational.',
                        sermonGoals: 'Encourage the church to stay faithful under pressure.',
                        style: sermon_workspace_entity_1.SermonStyle.EXPOSITORY,
                        storyArc: sermon_workspace_entity_1.StoryArc.PROBLEM_TRUTH_RESPONSE,
                        status: sermon_workspace_entity_1.WorkspaceStatus.IN_PROGRESS,
                        language: 'en',
                        egwEnabled: true,
                        sermonCore: {
                            bigIdea: 'Faithfulness to God shines brightest in the fire.',
                            fallenCondition: 'We often compromise when pressured by fear or opposition.',
                            centralTruth: 'God’s presence sustains His people when they stand for Him.',
                            sermonGoal: 'Call the congregation to courageous loyalty to Christ.',
                            audienceNeed: 'Believers need assurance that God is with them in trials.'
                        },
                    });
                    return [4 /*yield*/, workspaceRepository.save(workspace)];
                case 17:
                    _a.sent();
                    console.log('✅ Created English sermon workspace');
                    _a.label = 18;
                case 18: return [4 /*yield*/, workspaceRepository.findOne({
                        where: { userId: adminUser.id, title: 'La Gracia Transformadora' },
                    })];
                case 19:
                    workspaceEs = _a.sent();
                    if (!!workspaceEs) return [3 /*break*/, 21];
                    workspaceEs = workspaceRepository.create({
                        userId: adminUser.id,
                        title: 'Vida en Cristo',
                        seriesTitle: 'Viviendo en Cristo',
                        mainPassage: 'Efesios 2:1-10',
                        additionalPassages: ['Romanos 5:8', 'Tito 3:4-7'],
                        references: [
                            {
                                reference: 'Romanos 5:8',
                                context: 'Referencia inicial para el estudio',
                                addedAt: new Date().toISOString(),
                            },
                        ],
                        theme: 'La gracia de Dios nos transforma de muerte a vida.',
                        audienceProfile: 'Congregación hispana, familias y jóvenes.',
                        sermonGoals: 'Inspirar gratitud por la gracia de Dios y motivar a vivir en santidad.',
                        style: sermon_workspace_entity_1.SermonStyle.EXPOSITORY,
                        storyArc: sermon_workspace_entity_1.StoryArc.PROBLEM_TRUTH_RESPONSE,
                        status: sermon_workspace_entity_1.WorkspaceStatus.IN_PROGRESS,
                        language: 'es',
                        egwEnabled: true,
                        sermonCore: {
                            bigIdea: 'La gracia de Dios nos rescata de la muerte espiritual.',
                            fallenCondition: 'El pecado nos separa de Dios y nos deja sin vida espiritual.',
                            centralTruth: 'En Cristo somos vivificados y reconciliados con Dios.',
                            sermonGoal: 'Invitar a la congregación a vivir en la nueva vida de Cristo.',
                            audienceNeed: 'La iglesia necesita esperanza de transformación real.'
                        },
                    });
                    return [4 /*yield*/, workspaceRepository.save(workspaceEs)];
                case 20:
                    _a.sent();
                    console.log('✅ Created Spanish sermon workspace');
                    _a.label = 21;
                case 21: return [4 /*yield*/, outlineRepository.findOne({ where: { workspaceId: workspace.id } })];
                case 22:
                    outline = _a.sent();
                    if (!!outline) return [3 /*break*/, 24];
                    outline = outlineRepository.create({
                        workspaceId: workspace.id,
                        title: 'Faith Under Fire Outline',
                        structure: {
                            introduction: 'Setting the scene of the fiery furnace.',
                            points: [
                                'Conviction anchored in God’s character',
                                'Courage in the face of pressure',
                                'Christ present in the fire',
                            ],
                            conclusion: 'Invite the church to public trust.',
                        },
                        isSelected: true,
                        generatedBy: llm_provider_enum_1.LlmProvider.LOCAL,
                        generatedModel: 'local-model',
                    });
                    return [4 /*yield*/, outlineRepository.save(outline)];
                case 23:
                    _a.sent();
                    _a.label = 24;
                case 24: return [4 /*yield*/, manuscriptRepository.findOne({ where: { workspaceId: workspace.id } })];
                case 25:
                    manuscript = _a.sent();
                    if (!!manuscript) return [3 /*break*/, 27];
                    manuscript = manuscriptRepository.create({
                        workspaceId: workspace.id,
                        outlineId: outline.id,
                        content: {
                            intro: 'We all face moments when faith is tested.',
                            sections: [
                                {
                                    heading: 'Conviction',
                                    body: 'Shadrach, Meshach, and Abednego chose loyalty over safety.',
                                },
                                {
                                    heading: 'Courage',
                                    body: 'Faith sometimes means standing when others bow.',
                                },
                                {
                                    heading: 'Christ in the Fire',
                                    body: 'God’s presence is the promise, not avoidance of hardship.',
                                },
                            ],
                            conclusion: 'Invite the congregation to trust God publicly this week.',
                        },
                        wordCount: 1250,
                        estimatedMinutes: 18,
                        transitions: {
                            betweenPoints: 'Pause for reflection and prayer.'
                        },
                        generatedBy: llm_provider_enum_1.LlmProvider.LOCAL,
                        generatedModel: 'local-model',
                    });
                    return [4 /*yield*/, manuscriptRepository.save(manuscript)];
                case 26:
                    _a.sent();
                    _a.label = 27;
                case 27: return [4 /*yield*/, applicationRepository.count({ where: { workspaceId: workspace.id } })];
                case 28:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 30];
                    return [4 /*yield*/, applicationRepository.save([
                            applicationRepository.create({
                                workspaceId: workspace.id,
                                audienceType: sermon_application_entity_1.AudienceType.MIXED_CONGREGATION,
                                content: 'Identify one place you are tempted to compromise and choose obedience.',
                                orderIndex: 0,
                                isSelected: true,
                            }),
                            applicationRepository.create({
                                workspaceId: workspace.id,
                                audienceType: sermon_application_entity_1.AudienceType.SMALL_GROUP,
                                content: 'Share a story where God met you in adversity and pray for one another.',
                                orderIndex: 1,
                            }),
                        ])];
                case 29:
                    _a.sent();
                    _a.label = 30;
                case 30: return [4 /*yield*/, illustrationRepository.count({ where: { workspaceId: workspace.id } })];
                case 31:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, illustrationRepository.save(illustrationRepository.create({
                            workspaceId: workspace.id,
                            title: 'The Refiner’s Fire',
                            content: 'Gold is purified by heat, and faith is refined through trials.',
                            source: 'Pastoral illustration',
                            relatedPoint: 'Christ in the Fire',
                            tags: ['refining', 'faith', 'perseverance'],
                        }))];
                case 32:
                    _a.sent();
                    _a.label = 33;
                case 33: return [4 /*yield*/, dnaRepository.count({ where: { workspaceId: workspace.id } })];
                case 34:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 36];
                    return [4 /*yield*/, dnaRepository.save(dnaRepository.create({
                            userId: adminUser.id,
                            workspaceId: workspace.id,
                            summary: 'Strong narrative flow with emphasis on courage and God’s presence.',
                            themes: ['Courage', 'Presence', 'Faithfulness', 'Public Witness'],
                            scores: {
                                clarity: 8,
                                structure: 8,
                                scriptureFocus: 7,
                                applicationDepth: 7,
                            },
                        }))];
                case 35:
                    _a.sent();
                    _a.label = 36;
                case 36: return [4 /*yield*/, discussionRepository.count({ where: { workspaceId: workspace.id } })];
                case 37:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 39];
                    return [4 /*yield*/, discussionRepository.save([
                            discussionRepository.create({
                                workspaceId: workspace.id,
                                question: 'Where do you feel pressure to bow to culture rather than Christ?',
                                orderIndex: 0,
                                category: 'application',
                            }),
                            discussionRepository.create({
                                workspaceId: workspace.id,
                                question: 'How have you experienced God’s presence during hardship?',
                                orderIndex: 1,
                                category: 'testimony',
                            }),
                        ])];
                case 38:
                    _a.sent();
                    _a.label = 39;
                case 39: return [4 /*yield*/, citationRepository.count({ where: { workspaceId: workspace.id } })];
                case 40:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 42];
                    return [4 /*yield*/, citationRepository.save([
                            citationRepository.create({
                                workspaceId: workspace.id,
                                statementType: sermon_citation_entity_1.StatementType.OBSERVATION,
                                statement: 'God’s deliverance is not always removal but presence.',
                                verseReferences: ['Daniel 3:25', 'Isaiah 43:2'],
                                isVerified: true,
                            }),
                            citationRepository.create({
                                workspaceId: workspace.id,
                                statementType: sermon_citation_entity_1.StatementType.APPLICATION,
                                statement: 'Public faith shapes public witness.',
                                verseReferences: ['Matthew 5:14-16'],
                            }),
                        ])];
                case 41:
                    _a.sent();
                    _a.label = 42;
                case 42: return [4 /*yield*/, noteRepository.count({ where: { userId: adminUser.id } })];
                case 43:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 45];
                    return [4 /*yield*/, noteRepository.save([
                            noteRepository.create({
                                userId: adminUser.id,
                                workspaceId: workspace.id,
                                title: 'Sermon hook ideas',
                                content: 'Contrast comfort vs conviction in modern culture.',
                                verseReferences: ['Daniel 3:16-18'],
                                tags: ['hook', 'intro'],
                            }),
                            noteRepository.create({
                                userId: adminUser.id,
                                title: 'Prayer prompts',
                                content: 'Pray for courage in workplace witness.',
                                tags: ['prayer', 'application'],
                            }),
                        ])];
                case 44:
                    _a.sent();
                    _a.label = 45;
                case 45: return [4 /*yield*/, highlightRepository.count({ where: { userId: adminUser.id } })];
                case 46:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 48];
                    return [4 /*yield*/, highlightRepository.save([
                            highlightRepository.create({
                                userId: adminUser.id,
                                verseReference: 'Daniel 3:25',
                                translationId: kjvTranslation === null || kjvTranslation === void 0 ? void 0 : kjvTranslation.id,
                                color: '#F59E0B',
                                tags: ['presence', 'fire'],
                            }),
                            highlightRepository.create({
                                userId: adminUser.id,
                                verseReference: 'Isaiah 43:2',
                                translationId: kjvTranslation === null || kjvTranslation === void 0 ? void 0 : kjvTranslation.id,
                                color: '#10B981',
                                tags: ['promise'],
                            }),
                        ])];
                case 47:
                    _a.sent();
                    _a.label = 48;
                case 48: return [4 /*yield*/, wordStudyRepository.count({ where: { userId: adminUser.id } })];
                case 49:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 51];
                    return [4 /*yield*/, wordStudyRepository.save(wordStudyRepository.create({
                            userId: adminUser.id,
                            word: 'Faithful',
                            lemma: 'πιστός',
                            language: 'Greek',
                            transliteration: 'pistos',
                            definition: 'Trustworthy, dependable, believing.',
                            usageCount: 67,
                            verseExamples: ['1 Corinthians 4:2', '2 Timothy 2:13'],
                            notes: 'Faithfulness is active trust demonstrated in action.',
                        }))];
                case 50:
                    _a.sent();
                    _a.label = 51;
                case 51: return [4 /*yield*/, knowledgeRepository.count({ where: { userId: adminUser.id } })];
                case 52:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 54];
                    return [4 /*yield*/, knowledgeRepository.save([
                            knowledgeRepository.create({
                                userId: adminUser.id,
                                title: 'Daniel 3 background notes',
                                contentType: knowledge_content_entity_1.ContentType.STUDY_NOTE,
                                extractedText: 'Historical context about Babylonian worship practices.',
                                metadata: { source: 'Study Bible', tags: ['background'] },
                            }),
                            knowledgeRepository.create({
                                userId: adminUser.id,
                                title: 'Sermon research on persecution',
                                contentType: knowledge_content_entity_1.ContentType.SERMON,
                                originalFilename: 'persecution-notes.docx',
                                filePath: './uploads/seed/persecution-notes.docx',
                                extractedText: 'Key quotes from church history and modern examples.',
                                metadata: { tags: ['research', 'persecution'] },
                            }),
                        ])];
                case 53:
                    _a.sent();
                    _a.label = 54;
                case 54: return [4 /*yield*/, topicNodeRepository.findOne({
                        where: { userId: adminUser.id, topic: 'Courage' },
                    })];
                case 55:
                    courageNode = _a.sent();
                    if (!!courageNode) return [3 /*break*/, 57];
                    courageNode = topicNodeRepository.create({
                        userId: adminUser.id,
                        topic: 'Courage',
                        description: 'Biblical courage rooted in trust.',
                        relatedVerses: ['Joshua 1:9', 'Daniel 3:17'],
                        metadata: { category: 'character' },
                    });
                    return [4 /*yield*/, topicNodeRepository.save(courageNode)];
                case 56:
                    _a.sent();
                    _a.label = 57;
                case 57: return [4 /*yield*/, topicNodeRepository.findOne({
                        where: { userId: adminUser.id, topic: 'God’s Presence' },
                    })];
                case 58:
                    presenceNode = _a.sent();
                    if (!!presenceNode) return [3 /*break*/, 60];
                    presenceNode = topicNodeRepository.create({
                        userId: adminUser.id,
                        topic: 'God’s Presence',
                        description: 'The promise that God is with us in trials.',
                        relatedVerses: ['Isaiah 43:2', 'Matthew 28:20'],
                        metadata: { category: 'promise' },
                    });
                    return [4 /*yield*/, topicNodeRepository.save(presenceNode)];
                case 59:
                    _a.sent();
                    _a.label = 60;
                case 60: return [4 /*yield*/, topicEdgeRepository.count({ where: { sourceNodeId: courageNode.id } })];
                case 61:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 63];
                    return [4 /*yield*/, topicEdgeRepository.save(topicEdgeRepository.create({
                            sourceNodeId: courageNode.id,
                            targetNodeId: presenceNode.id,
                            relationshipType: 'flows_from',
                            strength: 9,
                        }))];
                case 62:
                    _a.sent();
                    _a.label = 63;
                case 63: return [4 /*yield*/, crossReferenceRepository.count()];
                case 64:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 66];
                    return [4 /*yield*/, crossReferenceRepository.save([
                            crossReferenceRepository.create({
                                sourceVerse: 'Daniel 3:25',
                                targetVerse: 'Isaiah 43:2',
                                relationshipType: 'presence',
                                strength: 9,
                            }),
                            crossReferenceRepository.create({
                                sourceVerse: 'Daniel 3:17',
                                targetVerse: '1 Peter 1:7',
                                relationshipType: 'refining',
                                strength: 7,
                            }),
                        ])];
                case 65:
                    _a.sent();
                    _a.label = 66;
                case 66: return [4 /*yield*/, aiConversationRepository.count({ where: { userId: adminUser.id } })];
                case 67:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 69];
                    return [4 /*yield*/, aiConversationRepository.save(aiConversationRepository.create({
                            userId: adminUser.id,
                            workspaceId: workspace.id,
                            mode: ai_conversation_entity_1.AiMode.MENTOR,
                            messages: [
                                { role: 'user', content: 'How do I help people face pressure at work?' },
                                { role: 'assistant', content: 'Point them to God’s presence and invite prayerful courage.' },
                            ],
                            context: { focus: 'workplace faith' },
                        }))];
                case 68:
                    _a.sent();
                    _a.label = 69;
                case 69: return [4 /*yield*/, llmRequestRepository.count({ where: { userId: adminUser.id } })];
                case 70:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 72];
                    return [4 /*yield*/, llmRequestRepository.save(llmRequestRepository.create({
                            userId: adminUser.id,
                            provider: llm_provider_enum_1.LlmProvider.LOCAL,
                            model: 'local-model',
                            prompt: 'Generate three sermon points for Daniel 3.',
                            response: '1) Conviction anchored in God. 2) Courage in pressure. 3) Christ in the fire.',
                            tokenCount: 182,
                            latencyMs: 940,
                            wasSuccessful: true,
                        }))];
                case 71:
                    _a.sent();
                    _a.label = 72;
                case 72:
                    demoWorkspaceTitle = 'Demo Sermon: John 3:16';
                    demoSeriesTitle = 'Demo Sermons';
                    demoNow = new Date();
                    demoNowIso = demoNow.toISOString();
                    demoPlanning = {
                        sermonDate: '2026-05-18',
                        targetLengthMinutes: 25,
                        serviceType: 'sabbath_worship',
                        appealStyle: 'invitation',
                        ministryMode: 'evangelistic',
                        bilingualMode: 'none',
                    };
                    demoMetadata = {
                        demo: {
                            enabled: true,
                            kind: 'john_3_16',
                            completedAt: demoNowIso,
                        },
                        planning: demoPlanning,
                        integrityReport: {
                            overallScore: 96,
                            balanced: true,
                            issues: [
                                {
                                    severity: 'warning',
                                    category: 'application',
                                    message: 'Keep the invitation clear and personal.',
                                    affectedItem: 'appeal',
                                },
                            ],
                            strengths: ['Scripture-first', 'Christ-centered', 'Pastoral clarity'],
                            updatedAt: demoNowIso,
                        },
                        mediaPack: {
                            status: 'ready',
                            generatedAt: demoNowIso,
                            sourceOutlineId: null,
                            sourceManuscriptId: null,
                            sourceStudyReportId: null,
                            slideCount: 13,
                            audioEnabled: true,
                            musicEnabled: true,
                            videoEnabled: true,
                            exportPrepared: true,
                        },
                        exportPack: {
                            status: 'ready',
                            generatedAt: demoNowIso,
                            sourceOutlineId: null,
                            sourceManuscriptId: null,
                            sourceStudyReportId: null,
                            artifacts: [
                                {
                                    type: 'pptx',
                                    label: 'Slide deck (PPTX)',
                                    status: 'ready',
                                    filename: 'sermon-deck-demo-sermon-john-3-16.pptx',
                                },
                                {
                                    type: 'pdf',
                                    label: 'Slide deck (PDF)',
                                    status: 'ready',
                                    filename: 'sermon-deck-demo-sermon-john-3-16.pdf',
                                },
                            ],
                        },
                    };
                    return [4 /*yield*/, workspaceRepository.findOne({
                            where: { userId: adminUser.id, title: demoWorkspaceTitle },
                        })];
                case 73:
                    demoWorkspace = _a.sent();
                    demoWorkspacePayload = {
                        userId: adminUser.id,
                        title: demoWorkspaceTitle,
                        seriesTitle: demoSeriesTitle,
                        mainPassage: 'John 3:16',
                        additionalPassages: ['Romans 5:8', 'Ephesians 2:8-9'],
                        theme: 'God’s love and salvation',
                        audienceProfile: 'General Sabbath congregation with members, visitors, young people, and people who may feel spiritually distant from God.',
                        sermonGoals: 'Help people see God as a loving Father who welcomes repentant sinners, restores dignity, and invites them back into relationship.',
                        theologicalLens: 'adventist',
                        style: sermon_workspace_entity_1.SermonStyle.EXPOSITORY,
                        storyArc: sermon_workspace_entity_1.StoryArc.PROBLEM_TRUTH_RESPONSE,
                        status: sermon_workspace_entity_1.WorkspaceStatus.COMPLETED,
                        language: 'en',
                        egwEnabled: true,
                        sermonCore: {
                            bigIdea: 'God’s love is revealed in Christ’s gift of salvation.',
                            fallenCondition: 'Sin leaves humanity separated and in need of rescue.',
                            centralTruth: 'Jesus is God’s gift so that believers may not perish but have eternal life.',
                            sermonGoal: 'Invite listeners to trust the Son and receive eternal life.',
                            audienceNeed: 'People need assurance that God loves them and makes salvation available now.',
                        },
                        scriptureCache: {
                            scriptureResult: {
                                reference: 'John 3:16',
                                translation: 'KJV',
                                verses: [
                                    {
                                        reference: 'John 3:16',
                                        text: 'For God so loved the world, that he gave his only begotten Son...',
                                    },
                                ],
                            },
                            scriptureTranslation: 'KJV',
                            scriptureLastLookup: 'John 3:16:KJV',
                            passageSummary: {
                                reference: 'John 3:16',
                                summary: 'John 3:16 centers salvation in God’s love, gift, and invitation to believe.',
                            },
                            translationComparison: {
                                reference: 'John 3:16',
                                translations: ['KJV', 'NIV', 'ESV'],
                                summary: 'All major translations present the same gospel invitation with slightly different wording.',
                            },
                            cachedAt: demoNow,
                        },
                        references: [
                            {
                                reference: 'John 3:16',
                                context: 'Canonical demo verse',
                                addedAt: demoNowIso,
                            },
                            {
                                reference: 'Romans 5:8',
                                context: 'Supporting cross-reference',
                                addedAt: demoNowIso,
                            },
                        ],
                        metadata: demoMetadata,
                    };
                    if (!!demoWorkspace) return [3 /*break*/, 75];
                    demoWorkspace = workspaceRepository.create(demoWorkspacePayload);
                    return [4 /*yield*/, workspaceRepository.save(demoWorkspace)];
                case 74:
                    _a.sent();
                    console.log('✅ Created canonical demo sermon workspace');
                    return [3 /*break*/, 77];
                case 75:
                    Object.assign(demoWorkspace, demoWorkspacePayload);
                    return [4 /*yield*/, workspaceRepository.save(demoWorkspace)];
                case 76:
                    _a.sent();
                    console.log('✅ Upserted canonical demo sermon workspace');
                    _a.label = 77;
                case 77: return [4 /*yield*/, studyReportRepository.delete({ workspaceId: demoWorkspace.id })];
                case 78:
                    _a.sent();
                    demoStudyReport = studyReportRepository.create({
                        workspaceId: demoWorkspace.id,
                        sections: {
                            title: 'John 3:16 Study Report',
                            passageSummary: {
                                summary: 'God’s love is the center of the passage and the basis of salvation.',
                            },
                            structureOfPassage: [
                                { movement: 'Love declared', verses: 'John 3:16a', summary: 'God initiates salvation in love.' },
                                { movement: 'Gift given', verses: 'John 3:16b', summary: 'The Son is given for the world.' },
                                { movement: 'Faith invited', verses: 'John 3:16c', summary: 'Belief opens the way to eternal life.' },
                            ],
                            keyTerms: [
                                { term: 'love', language: 'Greek', transliteration: 'agapaō', definition: 'Self-giving covenant love.', nuance: 'God’s love acts first.' },
                                { term: 'believe', language: 'Greek', transliteration: 'pisteuō', definition: 'Trust and rely upon.', nuance: 'Faith is personal trust, not mere assent.' },
                            ],
                            crossReferences: [
                                { reference: 'Romans 5:8', connection: 'God demonstrates love through Christ.', category: 'thematic', tier: 'primary' },
                                { reference: 'Ephesians 2:8-9', connection: 'Salvation is by grace through faith.', category: 'doctrinal', tier: 'secondary' },
                            ],
                            interpretiveChallenges: [
                                { issue: 'Scope of the word world', explanation: 'The verse speaks to humanity broadly, not a narrow group.' },
                            ],
                            egwSection: {
                                enabled: true,
                                notes: ['Christ’s gift reveals the heart of God.'],
                            },
                        },
                        generatedBy: llm_provider_enum_1.LlmProvider.LOCAL,
                        generatedModel: 'seed',
                    });
                    return [4 /*yield*/, studyReportRepository.save(demoStudyReport)];
                case 79:
                    _a.sent();
                    return [4 /*yield*/, outlineRepository.findOne({ where: { workspaceId: demoWorkspace.id } })];
                case 80:
                    demoOutline = _a.sent();
                    if (!!demoOutline) return [3 /*break*/, 82];
                    demoOutline = outlineRepository.create({
                        workspaceId: demoWorkspace.id,
                        title: 'John 3:16 Sermon Outline',
                        structure: {
                            introduction: 'God’s love is not abstract; it moves toward us in Christ.',
                            points: [
                                'God loves the world with saving love',
                                'God gives His Son for our rescue',
                                'We are invited to believe and live',
                            ],
                            pointNodes: [
                                {
                                    title: 'God loves the world with saving love',
                                    slideTitle: 'Love Revealed',
                                    summary: 'The gospel begins with God’s initiative.',
                                    supportingVerses: ['1 John 4:9-10'],
                                },
                                {
                                    title: 'God gives His Son for our rescue',
                                    slideTitle: 'Gift Given',
                                    summary: 'Salvation rests on Christ’s sacrificial gift.',
                                    supportingVerses: ['Romans 5:8'],
                                },
                                {
                                    title: 'We are invited to believe and live',
                                    slideTitle: 'Believe Today',
                                    summary: 'Faith receives the life God offers.',
                                    supportingVerses: ['Ephesians 2:8-9'],
                                },
                            ],
                            outlineType: 'expository',
                            sermonMovement: 'problem_truth_response',
                            conclusion: 'Invite the congregation to trust Jesus personally.',
                            callToAction: 'Believe in the Son and receive eternal life.',
                        },
                        isSelected: true,
                        generatedBy: llm_provider_enum_1.LlmProvider.LOCAL,
                        generatedModel: 'seed',
                    });
                    return [4 /*yield*/, outlineRepository.save(demoOutline)];
                case 81:
                    _a.sent();
                    return [3 /*break*/, 84];
                case 82:
                    if (!!demoOutline.isSelected) return [3 /*break*/, 84];
                    demoOutline.isSelected = true;
                    return [4 /*yield*/, outlineRepository.save(demoOutline)];
                case 83:
                    _a.sent();
                    _a.label = 84;
                case 84: return [4 /*yield*/, manuscriptRepository.findOne({ where: { workspaceId: demoWorkspace.id } })];
                case 85:
                    demoManuscript = _a.sent();
                    if (!!demoManuscript) return [3 /*break*/, 87];
                    demoManuscript = manuscriptRepository.create({
                        workspaceId: demoWorkspace.id,
                        outlineId: demoOutline.id,
                        content: {
                            intro: 'John 3:16 begins with the biggest news in the gospel: God loved the world.',
                            sections: [
                                {
                                    heading: 'God loves the world',
                                    body: 'The Father does not wait for humanity to earn His affection. Love moves first.',
                                },
                                {
                                    heading: 'God gave His Son',
                                    body: 'The cross shows that salvation is not sentimental; it is sacrificial.',
                                },
                                {
                                    heading: 'Believe and live',
                                    body: 'The invitation is personal. The response is faith, trust, and surrender.',
                                },
                            ],
                            conclusion: 'Call the church to receive Christ again with gratitude and faith.',
                            appeal: 'If you have never trusted Jesus, do it today. If you know Him, thank Him anew for His love.',
                        },
                        wordCount: 1180,
                        estimatedMinutes: 25,
                        transitions: {
                            betweenPoints: 'Move from God’s love, to God’s gift, to our response.',
                        },
                        generatedBy: llm_provider_enum_1.LlmProvider.LOCAL,
                        generatedModel: 'seed',
                    });
                    return [4 /*yield*/, manuscriptRepository.save(demoManuscript)];
                case 86:
                    _a.sent();
                    _a.label = 87;
                case 87: return [4 /*yield*/, citationRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 88:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 90];
                    return [4 /*yield*/, citationRepository.save([
                            citationRepository.create({
                                workspaceId: demoWorkspace.id,
                                statementType: sermon_citation_entity_1.StatementType.OBSERVATION,
                                statement: 'God’s love initiates the rescue of humanity.',
                                verseReferences: ['John 3:16', 'Romans 5:8'],
                                isVerified: true,
                            }),
                            citationRepository.create({
                                workspaceId: demoWorkspace.id,
                                statementType: sermon_citation_entity_1.StatementType.APPLICATION,
                                statement: 'Belief is a real response to a real gift.',
                                verseReferences: ['Ephesians 2:8-9'],
                                isVerified: true,
                            }),
                        ])];
                case 89:
                    _a.sent();
                    _a.label = 90;
                case 90: return [4 /*yield*/, dnaRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 91:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 93];
                    return [4 /*yield*/, dnaRepository.save(dnaRepository.create({
                            userId: adminUser.id,
                            workspaceId: demoWorkspace.id,
                            summary: 'John 3:16 centers the sermon on God’s love, Christ’s gift, and a clear invitation to faith.',
                            themes: ['Love', 'Gift', 'Faith', 'Salvation'],
                            scores: {
                                clarity: 9,
                                structure: 9,
                                scriptureFocus: 10,
                                applicationDepth: 8,
                            },
                        }))];
                case 92:
                    _a.sent();
                    _a.label = 93;
                case 93: return [4 /*yield*/, theologicalCenterRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 94:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 96];
                    return [4 /*yield*/, theologicalCenterRepository.save(theologicalCenterRepository.create({
                            workspaceId: demoWorkspace.id,
                            dominantCenter: 'God’s love revealed in Christ',
                            textualWarrant: 'John 3:16 names God’s love, gift, and invitation to believe.',
                            alignmentScore: 0.98,
                            deviations: [
                                {
                                    point: 'Avoid turning the sermon into a generic moral appeal.',
                                    severity: 'minor',
                                    explanation: 'Keep the focus on God’s gift before moving to response.',
                                },
                            ],
                            secondaryThemes: ['Grace', 'Faith', 'Eternal Life'],
                            suppressionSuggestions: [
                                {
                                    theme: 'Self-help framing',
                                    reason: 'It weakens the gospel center.',
                                    impact: 'Maintain Christ-centered clarity.',
                                },
                            ],
                        }))];
                case 95:
                    _a.sent();
                    _a.label = 96;
                case 96: return [4 /*yield*/, tensionRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 97:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 99];
                    return [4 /*yield*/, tensionRepository.save(tensionRepository.create({
                            workspaceId: demoWorkspace.id,
                            tensions: [
                                {
                                    type: 'theological_friction',
                                    text: 'Love and judgment are both present in the wider John 3 context.',
                                    verseReference: 'John 3:16-18',
                                    explanation: 'The passage should not minimize the seriousness of unbelief.',
                                    preservationStrategy: 'Let the invitation stay warm while the warning remains clear.',
                                },
                            ],
                            sermonTensionHandling: [
                                {
                                    tension: 'Invitation vs. warning',
                                    isPreserved: true,
                                    resolutionTiming: 'appropriate',
                                    recommendation: 'Hold both with pastoral clarity.',
                                },
                            ],
                            tensionPreservationScore: 0.95,
                        }))];
                case 98:
                    _a.sent();
                    _a.label = 99;
                case 99: return [4 /*yield*/, doctrinalCheckRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 100:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 102];
                    return [4 /*yield*/, doctrinalCheckRepository.save(doctrinalCheckRepository.create({
                            workspaceId: demoWorkspace.id,
                            checks: [
                                {
                                    category: doctrinal_precision_check_entity_1.DoctrinalCategory.GRACE,
                                    isConsistent: true,
                                    concern: null,
                                    recommendation: null,
                                    severity: 'info',
                                },
                                {
                                    category: doctrinal_precision_check_entity_1.DoctrinalCategory.LAW_AND_GOSPEL,
                                    isConsistent: true,
                                    concern: null,
                                    recommendation: null,
                                    severity: 'info',
                                },
                            ],
                            overallConsistencyScore: 0.98,
                            summary: 'The sermon remains Christ-centered, grace-filled, and faithful to the gospel invitation.',
                        }))];
                case 101:
                    _a.sent();
                    _a.label = 102;
                case 102: return [4 /*yield*/, preachingStrategyRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 103:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 105];
                    return [4 /*yield*/, preachingStrategyRepository.save(preachingStrategyRepository.create({
                            workspaceId: demoWorkspace.id,
                            recommendedGenre: preaching_strategy_entity_1.PreachingGenre.EXPOSITORY,
                            genreRationale: 'John 3:16 is text-driven and best served by a clear verse-by-verse movement.',
                            emotionalArc: preaching_strategy_entity_1.EmotionalArc.CONVICTION_TO_HOPE,
                            tone: 'hopeful',
                            targetLengthMinutes: 25,
                            tensionLevel: 0.45,
                            applicationDensity: 0.7,
                            invitationDriven: true,
                            structuralGuidance: {
                                introduction: 'Begin with God’s love.',
                                bodyStructure: 'Move from love to gift to faith.',
                                conclusion: 'End with a direct invitation to believe.',
                            },
                        }))];
                case 104:
                    _a.sent();
                    _a.label = 105;
                case 105: return [4 /*yield*/, historicalContextRepository.count({ where: { workspaceId: demoWorkspace.id } })];
                case 106:
                    if (!((_a.sent()) === 0)) return [3 /*break*/, 108];
                    return [4 /*yield*/, historicalContextRepository.save(historicalContextRepository.create({
                            workspaceId: demoWorkspace.id,
                            passage: 'John 3:16',
                            socialRealities: [
                                {
                                    aspect: 'Religious expectation',
                                    description: 'Listeners would hear Jesus in conversation about kingdom life and belief.',
                                    impact: 'The verse calls for a personal response to divine initiative.',
                                },
                            ],
                            powerStructures: [
                                {
                                    structure: 'Roman occupation',
                                    dynamics: 'Politics and pressure shaped daily life.',
                                    relevance: 'The gospel offers a greater hope than earthly systems.',
                                },
                            ],
                            economicContext: [
                                {
                                    factor: 'Ordinary households',
                                    description: 'The promise of eternal life speaks to everyday people, not elites only.',
                                },
                            ],
                            religiousClimate: [
                                {
                                    element: 'Temple-centered piety',
                                    description: 'Many expected God to work through established forms.',
                                    tension: 'Jesus redirects attention to faith in Him.',
                                },
                            ],
                            audiencePressures: [
                                {
                                    pressure: 'Fear of exclusion',
                                    source: 'Religious and social boundaries',
                                    pastoralResponse: 'The gospel extends welcome to the believing world.',
                                },
                            ],
                            synthesisStatement: 'The passage is a public invitation to trust God’s love made visible in Christ.',
                        }))];
                case 107:
                    _a.sent();
                    _a.label = 108;
                case 108:
                    console.log('✅ Seed completed successfully!');
                    return [4 /*yield*/, dataSource.destroy()];
                case 109:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    seed().catch(console.error);
}
