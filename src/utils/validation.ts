import { ValidationError } from 'class-validator';

export interface FieldError {
  id?: string;
  message: string;
  constraints?: { [key: string]: string };
}

export interface FieldErrors {
  [key: string]: FieldError;
}

export function flatten(
  validationErrors: ValidationError[],
  prefix = '',
): FieldErrors {
  let fieldErrors: FieldErrors = {};
  for (const { property, children, constraints, value } of validationErrors) {
    // use slug instead of index number
    // slug should be unique in all lists
    const name =
      property && property.match(/^[0-9]+$/) && typeof value.slug === 'string'
        ? value.slug
        : property;
    if (constraints) {
      fieldErrors[`${prefix}${name}`] = {
        constraints,
        message: Object.values(constraints).join(', '),
      };
    }
    if (children) {
      fieldErrors = {
        ...fieldErrors,
        ...flatten(children, `${prefix}${name}.`),
      };
    }
  }
  return fieldErrors;
}
