import { NotificationPort } from '../../application/ports/notification-port.js';
export class InMemoryNotificationService implements NotificationPort { readonly messages: { permitId: string; event: string; recipients: readonly string[] }[] = []; async notify(input: { permitId: string; event: string; recipients: readonly string[] }): Promise<void> { this.messages.push(input); } }
