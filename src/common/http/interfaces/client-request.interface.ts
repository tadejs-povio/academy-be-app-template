import type { Request } from 'express';

export interface ClientRequest extends Request {
  id: string;
}
