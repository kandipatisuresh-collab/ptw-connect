import { NotificationPort } from '../../application/ports/notification-port.js';
export declare class InMemoryNotificationService implements NotificationPort {
    readonly messages: {
        permitId: string;
        event: string;
        recipients: readonly string[];
    }[];
    notify(input: {
        permitId: string;
        event: string;
        recipients: readonly string[];
    }): Promise<void>;
}
