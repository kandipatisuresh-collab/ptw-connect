export type UUID = string;
export type CorrelationId = string;

export type PermitStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SAFETY_REVIEW'
  | 'ISOLATION_PENDING'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ISSUED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RESUMED'
  | 'EXTENSION_REQUESTED'
  | 'EXPIRED'
  | 'CLOSURE_PENDING'
  | 'CLOSED'
  | 'CANCELLED';

export interface ActorContext {
  userId: UUID;
  roles: readonly string[];
  plantIds: readonly string[];
  areaIds: readonly string[];
  correlationId: CorrelationId;
}

export interface VersionedRecord {
  id: UUID;
  version: number;
  createdAt: string;
  updatedAt: string;
}
