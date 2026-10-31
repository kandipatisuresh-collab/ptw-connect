export interface ScanningPort {
    scan(reference: string): Promise<'PENDING' | 'CLEAN' | 'QUARANTINED'>;
}
