import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBibleReference(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBibleReference',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // Bible reference pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
          const pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/;
          return pattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid Bible reference format. Expected format: "Book Chapter:Verse" (e.g., "John 3:16")';
        }
      }
    });
  };
}

export function IsOptionalBibleReference(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOptionalBibleReference',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Optional
          if (typeof value !== 'string') return false;
          
          const pattern = /^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/;
          return pattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid Bible reference format. Expected format: "Book Chapter:Verse" (e.g., "John 3:16")';
        }
      }
    });
  };
}
