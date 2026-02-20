/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';

export interface AuditLogEntry {
  action: string;
  userId: string;
  resourceId: string;
  meta?: Record<string, unknown>;
}

/**
 * AuditService — persist audit trail entries.
 * Replace the logger-only implementation with your real persistence layer
 * (e.g. a TypeORM AuditLog entity) when ready.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async log(entry: AuditLogEntry): Promise<void> {
    this.logger.log(
      `[AUDIT] action=${entry.action} userId=${entry.userId} resourceId=${entry.resourceId} meta=${JSON.stringify(entry.meta ?? {})}`,
    );
  }
}
