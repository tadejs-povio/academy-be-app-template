export interface BaseErrorArgs {
  message?: string;
  meta?: Record<string, any>;
  cause?: Error;
}

/**
 * Base class for all internal errors
 */
export abstract class BaseError extends Error {
  abstract code: string;
  readonly meta?: Record<string, any>;

  constructor(data: BaseErrorArgs) {
    super(data?.message, {
      cause: data.cause,
    });

    this.meta = data?.meta;
  }
}
