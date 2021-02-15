import { Injectable, ArgumentMetadata, ValidationPipe } from '@nestjs/common';

export type ExplicitConverter = (<T>(value: string) => T) | { [value: string]: any };
export type CustomConverter = (queryObject: any, metadata?: ArgumentMetadata) => any;

const implicitQueryParams = (
  explicitConverters: { [queryField: string]: ExplicitConverter } = {},
  customConverters: CustomConverter[] = [],
): ValidationPipe => {
  // Here are defined query params' types converters
  const converters: CustomConverter[] = [
    // Explicit converters
    (queryObject: any) => {
      if (typeof queryObject === 'object') {
        Object.keys(queryObject).forEach((key) => {
          const currentValue: string = queryObject[key];
          const explicitConverter: ExplicitConverter = explicitConverters[key];

          let convertedValue: any;

          switch (typeof explicitConverter) {
            case 'function':
              convertedValue = explicitConverter(currentValue);
              break;
            case 'object':
              if (currentValue in explicitConverter) {
                convertedValue = explicitConverter[currentValue];
              } else {
                return;
              }
              break;
            default:
              return;
          }

          queryObject[key] = convertedValue;
        });
      }

      return queryObject;
    },

    // Custom query object converters
    ...customConverters,

    // Default converter
    (new ValidationPipe()).transform,
  ];

  @Injectable()
  class ImplicitParamsValidationPipe extends ValidationPipe {
    transform(queryObject: any, metadata: ArgumentMetadata): any {
      if (metadata.type !== 'query') {
        throw new Error(
          `The ${implicitQueryParams.name} can be applied only for query params!`,
        );
      }

      return converters.reduce(
        (result, transform) => transform.bind(this)(result, metadata),
        queryObject,
      );
    }
  }

  return new ImplicitParamsValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
};

export default implicitQueryParams;
