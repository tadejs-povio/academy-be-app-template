import { FieldErrors } from '~utils/validation';

export const INPUT_VALIDATION_ERROR = 'INPUT_VALIDATION_ERROR';

export class ValidationError extends Error {
  public fieldErrors: FieldErrors = {};

  constructor(fieldErrors: FieldErrors = {}) {
    super();
    this.fieldErrors = fieldErrors;
  }
}
