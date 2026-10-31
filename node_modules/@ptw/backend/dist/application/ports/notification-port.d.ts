import { PermitStatus } from '../../domain/shared/types.js';
export interface NotificationPort {
    notify(input: {
        permitId: string;
        event: string;
        recipients: readonly string[];
        status?: PermitStatus;
    }): Promise<void>;
}
