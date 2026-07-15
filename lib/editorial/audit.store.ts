export interface AuditLog {
  id?: string;
  action: string;
  targetId?: number;
  userId?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

const logs: AuditLog[] = [];

export function logAction(
  entry: AuditLog
) {
  logs.push(entry);
}

export function getAuditLogs() {
  return [...logs];
}