export interface IntegrationTransaction { correlationId: string; requestId: string; objectType: string; objectId: string; status: 'SUCCEEDED' | 'FAILED' | 'RETRYING'; errorCode?: string; errorMessage?: string; retryCount: number; }

export interface IntegrationTransactionStore { append(transaction: IntegrationTransaction): Promise<void>; }

export class SynchronizationService {
  public constructor(private readonly store: IntegrationTransactionStore) {}
  async recordFailure(input: Omit<IntegrationTransaction, 'status'>): Promise<void> {
    await this.store.append({ ...input, status: 'FAILED' });
  }
}
