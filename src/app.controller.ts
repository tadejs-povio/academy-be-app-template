import { Controller, Get } from '@nestjs/common';

import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return 'Ok';
  }
}
