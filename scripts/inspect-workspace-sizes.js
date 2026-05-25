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
(0, dotenv_1.config)();
var workspaceId = process.env.WORKSPACE_ID || '0ceaeb20-a88c-42ba-85c9-ad182d76865d';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tableNames, existingTables, existing, countColumns, counts, _a, sizes, relationSizes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, typeorm_config_1.default.initialize()];
                case 1:
                    _b.sent();
                    tableNames = [
                        'sermon_outlines',
                        'sermon_manuscripts',
                        'sermon_applications',
                        'sermon_illustrations',
                        'discussion_questions',
                        'sermon_citations',
                        'sermon_dna_analyses',
                        'sermon_study_reports',
                        'notes',
                        'ai_conversations',
                        'theological_center_analyses',
                        'tension_analyses',
                        'doctrinal_precision_checks',
                        'blind_spot_analyses',
                        'preaching_strategies',
                        'historical_contexts_enhanced',
                    ];
                    return [4 /*yield*/, typeorm_config_1.default.query("select tablename from pg_tables where schemaname = 'public' and tablename = any($1::text[])", [tableNames])];
                case 2:
                    existingTables = _b.sent();
                    existing = new Set(existingTables.map(function (row) { return row.tablename; }));
                    countColumns = tableNames
                        .filter(function (name) { return existing.has(name); })
                        .map(function (name) { return "(select count(*) from ".concat(name, " where \"workspaceId\" = $1) as ").concat(name); });
                    if (!countColumns.length) return [3 /*break*/, 4];
                    return [4 /*yield*/, typeorm_config_1.default.query("select ".concat(countColumns.join(',\n        ')), [workspaceId])];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = [{}];
                    _b.label = 5;
                case 5:
                    counts = _a;
                    return [4 /*yield*/, typeorm_config_1.default.query("\n      select\n        pg_column_size(metadata) as metadata_bytes,\n        pg_column_size(\"scriptureCache\") as scripture_cache_bytes,\n        pg_column_size(\"references\") as references_bytes,\n        pg_column_size(\"sermonCore\") as sermon_core_bytes\n      from sermon_workspaces\n      where id = $1\n    ", [workspaceId])];
                case 6:
                    sizes = _b.sent();
                    return [4 /*yield*/, typeorm_config_1.default.query("\n      select\n        'sermon_outlines' as table_name,\n        count(*) as rows,\n        coalesce(sum(pg_column_size(structure)), 0) as json_bytes,\n        coalesce(sum(length(coalesce(title, ''))), 0) as text_bytes\n      from sermon_outlines\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_manuscripts',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(content)), 0) as json_bytes,\n        coalesce(sum(length(coalesce(content::text, ''))), 0) as text_bytes\n      from sermon_manuscripts\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_study_reports',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(sections)), 0) as json_bytes,\n        coalesce(sum(length(coalesce(\"rawResponse\", ''))), 0) as text_bytes\n      from sermon_study_reports\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_citations',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from sermon_citations s\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_applications',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from sermon_applications s\n      where \"workspaceId\" = $1\n      union all\n      select\n        'discussion_questions',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from discussion_questions s\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_illustrations',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from sermon_illustrations s\n      where \"workspaceId\" = $1\n      union all\n      select\n        'sermon_dna_analyses',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from sermon_dna_analyses s\n      where \"workspaceId\" = $1\n      union all\n      select\n        'historical_contexts_enhanced',\n        count(*) as rows,\n        coalesce(sum(pg_column_size(row_to_json(s))), 0) as json_bytes,\n        0 as text_bytes\n      from historical_contexts_enhanced s\n      where \"workspaceId\" = $1\n    ", [workspaceId])];
                case 7:
                    relationSizes = _b.sent();
                    console.log(JSON.stringify({ workspaceId: workspaceId, counts: counts[0] || counts, sizes: sizes[0] || sizes, relationSizes: relationSizes }, null, 2));
                    return [4 /*yield*/, typeorm_config_1.default.destroy()];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error(error);
    process.exit(1);
});
