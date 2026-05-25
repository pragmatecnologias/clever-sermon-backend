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
exports.ContentValidatorService = void 0;
var common_1 = require("@nestjs/common");
var sda_alignment_1 = require("../llm/sda-alignment");
var helpers_1 = require("./helpers");
var ContentValidatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ContentValidatorService = _classThis = /** @class */ (function () {
        function ContentValidatorService_1() {
        }
        /**
         * Validate sermon content for SDA doctrinal alignment
         */
        ContentValidatorService_1.prototype.validateSermonContent = function (content) {
            var _a, _b, _c, _d, _e, _f;
            var scans = {};
            var recommendations = [];
            var totalIssues = 0;
            var totalChecks = 0;
            // Scan outline
            if ((_b = (_a = content.outline) === null || _a === void 0 ? void 0 : _a.structure) === null || _b === void 0 ? void 0 : _b.points) {
                var outlineText = helpers_1.WorkspaceHelpers.extractOutlinePointTexts(content.outline.structure).join(' ');
                scans.outline = sda_alignment_1.SDAAlignmentService.scanContent(outlineText);
                totalIssues += scans.outline.issues.length;
                totalChecks++;
                if (scans.outline.hasIssues) {
                    scans.outline.issues.forEach(function (issue) {
                        recommendations.push("Outline: ".concat(issue.suggestion));
                    });
                }
            }
            // Scan manuscript
            if ((_d = (_c = content.manuscript) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.text) {
                scans.manuscript = sda_alignment_1.SDAAlignmentService.scanContent(content.manuscript.content.text);
                totalIssues += scans.manuscript.issues.length;
                totalChecks++;
                if (scans.manuscript.hasIssues) {
                    scans.manuscript.issues.forEach(function (issue) {
                        recommendations.push("Manuscript: ".concat(issue.suggestion));
                    });
                }
            }
            // Scan applications
            if ((_e = content.applications) === null || _e === void 0 ? void 0 : _e.length) {
                scans.applications = [];
                content.applications.forEach(function (app, idx) {
                    var scan = sda_alignment_1.SDAAlignmentService.scanContent(app.content || '');
                    scans.applications.push(scan);
                    totalIssues += scan.issues.length;
                    totalChecks++;
                    if (scan.hasIssues) {
                        scan.issues.forEach(function (issue) {
                            recommendations.push("Application ".concat(idx + 1, ": ").concat(issue.suggestion));
                        });
                    }
                });
            }
            // Scan illustrations
            if ((_f = content.illustrations) === null || _f === void 0 ? void 0 : _f.length) {
                scans.illustrations = [];
                content.illustrations.forEach(function (illus, idx) {
                    var scan = sda_alignment_1.SDAAlignmentService.scanContent(illus.content || '');
                    scans.illustrations.push(scan);
                    totalIssues += scan.issues.length;
                    totalChecks++;
                    if (scan.hasIssues) {
                        scan.issues.forEach(function (issue) {
                            recommendations.push("Illustration ".concat(idx + 1, ": ").concat(issue.suggestion));
                        });
                    }
                });
            }
            // Calculate score
            var score = totalChecks > 0 ? Math.round(((totalChecks - totalIssues) / totalChecks) * 100) : 100;
            var passed = score >= 80;
            return {
                passed: passed,
                score: score,
                scans: scans,
                recommendations: recommendations
            };
        };
        /**
         * Auto-fix common issues in content
         */
        ContentValidatorService_1.prototype.autoFixContent = function (content) {
            return sda_alignment_1.SDAAlignmentService.transformContent(content);
        };
        /**
         * Validate and transform if needed
         */
        ContentValidatorService_1.prototype.validateAndTransform = function (content, autoFix) {
            if (autoFix === void 0) { autoFix = false; }
            var scan = sda_alignment_1.SDAAlignmentService.scanContent(content);
            if (autoFix && scan.hasIssues) {
                return {
                    original: content,
                    transformed: sda_alignment_1.SDAAlignmentService.transformContent(content),
                    scan: scan
                };
            }
            return {
                original: content,
                scan: scan
            };
        };
        return ContentValidatorService_1;
    }());
    __setFunctionName(_classThis, "ContentValidatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContentValidatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContentValidatorService = _classThis;
}();
exports.ContentValidatorService = ContentValidatorService;
