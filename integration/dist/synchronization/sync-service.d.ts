export interface IntegrationTransaction {
    correlationId: string;
    requestId: string;
    objectType: string;
    objectId: string;
    status: 'SUCCEEDED' | 'FAILED' | 'RETRYING';
    errorCode?: string;
    errorMessage?: string;
    retryCount: number;
}
export interface IntegrationTransactionStore {
    append(transaction: IntegrationTransaction): Promise<void>;
}
export declare class SynchronizationService {
    private readonly store;
    constructor(store: IntegrationTransactionStore);
    recordFailure(input: Omit<IntegrationTransaction, 'status'>): Promise<void>;
}
