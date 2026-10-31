export interface SyncAction {
    id: string;
    permitId: string;
    type: string;
    payload: Record<string, unknown>;
}
export interface SyncResult {
    id: string;
    state: 'APPLIED' | 'CONFLICT' | 'REJECTED';
    reason?: string;
}
export declare function synchronize(actions: readonly SyncAction[], currentVersions: ReadonlyMap<string, number>, expectedVersions: ReadonlyMap<string, number>): readonly SyncResult[];
