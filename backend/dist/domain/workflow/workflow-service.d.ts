import { PermitStatus } from '../shared/types.js';
export declare function assertTransition(from: PermitStatus, to: PermitStatus): void;
export declare function allowedTransitions(status: PermitStatus): readonly PermitStatus[];
