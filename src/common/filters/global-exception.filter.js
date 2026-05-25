"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GlobalExceptionFilter = void 0;
var common_1 = require("@nestjs/common");
var GlobalExceptionFilter = function () {
    var _classDecorators = [(0, common_1.Catch)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GlobalExceptionFilter = _classThis = /** @class */ (function () {
        function GlobalExceptionFilter_1() {
            this.logger = new common_1.Logger(GlobalExceptionFilter.name);
        }
        GlobalExceptionFilter_1.prototype.catch = function (exception, host) {
            var ctx = host.switchToHttp();
            var response = ctx.getResponse();
            var request = ctx.getRequest();
            var status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            var message = 'Internal server error';
            var errors = null;
            if (exception instanceof common_1.HttpException) {
                status = exception.getStatus();
                var exceptionResponse = exception.getResponse();
                if (typeof exceptionResponse === 'object') {
                    message = exceptionResponse.message || message;
                    errors = exceptionResponse.errors || null;
                }
                else {
                    message = exceptionResponse;
                }
            }
            else if (exception instanceof Error) {
                message = exception.message;
                this.logger.error("Unhandled exception: ".concat(exception.message), exception.stack);
            }
            else {
                this.logger.error('Unknown exception type', exception);
            }
            // Log error details
            this.logger.error("".concat(request.method, " ").concat(request.url, " - Status: ").concat(status, " - Message: ").concat(message));
            // Send user-friendly error response
            response.status(status).json(__assign(__assign({ statusCode: status, timestamp: new Date().toISOString(), path: request.url, method: request.method, message: this.getUserFriendlyMessage(status, message) }, (errors && { errors: errors })), (process.env.NODE_ENV === 'development' && {
                originalMessage: message,
                stack: exception instanceof Error ? exception.stack : undefined
            })));
        };
        GlobalExceptionFilter_1.prototype.getUserFriendlyMessage = function (status, originalMessage) {
            // Map technical errors to user-friendly messages
            var friendlyMessages = {
                400: 'Invalid request. Please check your input and try again.',
                401: 'Authentication required. Please log in.',
                403: 'You do not have permission to access this resource.',
                404: 'The requested resource was not found.',
                409: 'This operation conflicts with existing data.',
                422: 'The data provided could not be processed.',
                429: 'Too many requests. Please try again later.',
                500: 'An unexpected error occurred. Our team has been notified.',
                502: 'Service temporarily unavailable. Please try again.',
                503: 'Service is currently under maintenance.',
            };
            // Check for specific error patterns
            if (originalMessage.includes('LLM') || originalMessage.includes('generation')) {
                return 'Content generation failed. Please try again or adjust your request.';
            }
            if (originalMessage.includes('Bible') || originalMessage.includes('passage')) {
                return 'Unable to retrieve Bible passage. Please check the reference and try again.';
            }
            if (originalMessage.includes('EGW') || originalMessage.includes('Ellen')) {
                return 'Unable to retrieve Spirit of Prophecy content. Please try again.';
            }
            return friendlyMessages[status] || originalMessage;
        };
        return GlobalExceptionFilter_1;
    }());
    __setFunctionName(_classThis, "GlobalExceptionFilter");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalExceptionFilter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalExceptionFilter = _classThis;
}();
exports.GlobalExceptionFilter = GlobalExceptionFilter;
