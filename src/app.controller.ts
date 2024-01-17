import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): any {
    return { status: 'Running', message: 'Welcome to the Faro API' };
  }
}
