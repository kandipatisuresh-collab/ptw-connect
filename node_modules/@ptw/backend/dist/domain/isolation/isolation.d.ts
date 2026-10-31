export type IsolationStatus = 'REQUESTED' | 'PLANNED' | 'APPLIED' | 'VERIFIED' | 'RELEASED';
export interface Isolation {
    id: string;
    permitId: string;
    type: string;
    point: string;
    status: IsolationStatus;
}
export declare function transitionIsolation(isolation: Isolation, next: IsolationStatus): Isolation;
export declare function allRequiredIsolationsVerified(items: readonly Isolation[]): boolean;
