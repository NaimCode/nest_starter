import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['api-key'];
    const apiKeyQueryParam = request.query['api-key'];
    const apiKey = apiKeyHeader || apiKeyQueryParam;
    if (!apiKey) {
      throw new UnauthorizedException('API key not found');
    }
    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('API key invalid');
    }

    return true;
  }
}
