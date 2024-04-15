import { Expose } from 'class-transformer';

export class ErrorResponseDto {
  @Expose()
  code!: string;

  @Expose()
  message!: string;

  @Expose()
  details?: Record<string, any>;

  @Expose()
  meta?: Record<string, any>;

  constructor(data: ErrorResponseDto) {
    Object.assign(this, data);
  }
}
