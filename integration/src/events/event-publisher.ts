export interface DomainEvent { id: string; type: string; version: number; correlationId: string; occurredAt: string; payload: Record<string, unknown>; }
export interface EventPublisher { publish(event: DomainEvent): Promise<void>; }
