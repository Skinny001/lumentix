import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RateLimitEntry>();

  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 100, windowMs = 60_000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    /**
     * Use req.ip which Express resolves correctly when `trust proxy` is
     * configured in main.ts:
     *   app.getHttpAdapter().getInstance().set('trust proxy', 1);
     *
     * Do NOT read X-Forwarded-For directly — it is spoofable by any client.
     */
    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown'; // ← fixed

    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || now > entry.resetAt) {
      this.store.set(ip, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    entry.count += 1;

    if (entry.count > this.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again after ${Math.ceil((entry.resetAt - now) / 1000)}s.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
