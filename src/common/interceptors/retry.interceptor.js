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
exports.RetryInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var RetryInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RetryInterceptor = _classThis = /** @class */ (function () {
        function RetryInterceptor_1() {
            this.logger = new common_1.Logger(RetryInterceptor.name);
            this.maxRetries = 3;
            this.retryDelay = 1000; // 1 second
        }
        RetryInterceptor_1.prototype.intercept = function (context, next) {
            var _this = this;
            var request = context.switchToHttp().getRequest();
            var isRetryable = this.isRetryableRequest(request);
            if (!isRetryable) {
                return next.handle();
            }
            return next.handle().pipe((0, operators_1.retry)({
                count: this.maxRetries,
                delay: function (error, retryCount) {
                    if (!_this.isRetryableError(error)) {
                        throw error;
                    }
                    _this.logger.warn("Retrying request ".concat(request.method, " ").concat(request.url, " (attempt ").concat(retryCount, "/").concat(_this.maxRetries, ")"));
                    // Exponential backoff - return timer observable
                    var delayMs = _this.retryDelay * Math.pow(2, retryCount - 1);
                    return (0, rxjs_1.timer)(delayMs);
                },
            }), (0, operators_1.catchError)(function (error) {
                _this.logger.error("Request failed after ".concat(_this.maxRetries, " retries: ").concat(request.method, " ").concat(request.url), error.stack);
                return (0, rxjs_1.throwError)(function () { return error; });
            }));
        };
        RetryInterceptor_1.prototype.isRetryableRequest = function (request) {
            // Only retry GET requests and specific safe operations
            return request.method === 'GET' ||
                request.url.includes('/passage') ||
                request.url.includes('/search');
        };
        RetryInterceptor_1.prototype.isRetryableError = function (error) {
            var _a;
            // Retry on network errors, timeouts, and 5xx errors
            var retryableStatusCodes = [408, 429, 500, 502, 503, 504];
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) {
                return retryableStatusCodes.includes(error.response.status);
            }
            // Retry on network errors
            return error.code === 'ECONNRESET' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ECONNREFUSED';
        };
        return RetryInterceptor_1;
    }());
    __setFunctionName(_classThis, "RetryInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RetryInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RetryInterceptor = _classThis;
}();
exports.RetryInterceptor = RetryInterceptor;
