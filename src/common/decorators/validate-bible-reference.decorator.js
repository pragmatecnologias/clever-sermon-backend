"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBibleReference = IsBibleReference;
exports.IsOptionalBibleReference = IsOptionalBibleReference;
var class_validator_1 = require("class-validator");
function IsBibleReference(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isBibleReference',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: function (value, args) {
                    if (typeof value !== 'string')
                        return false;
                    // Bible reference pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
                    var pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/;
                    return pattern.test(value);
                },
                defaultMessage: function (args) {
                    return 'Invalid Bible reference format. Expected format: "Book Chapter:Verse" (e.g., "John 3:16")';
                }
            }
        });
    };
}
function IsOptionalBibleReference(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isOptionalBibleReference',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate: function (value, args) {
                    if (!value)
                        return true; // Optional
                    if (typeof value !== 'string')
                        return false;
                    var pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/;
                    return pattern.test(value);
                },
                defaultMessage: function (args) {
                    return 'Invalid Bible reference format. Expected format: "Book Chapter:Verse" (e.g., "John 3:16")';
                }
            }
        });
    };
}
