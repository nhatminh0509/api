import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { a: number; b: number } {
    return {
      a: 1,
      b: 2,
    };
  }
}
