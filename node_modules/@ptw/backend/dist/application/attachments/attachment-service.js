import { validateAttachment } from '../../domain/attachments/attachment.js';
export class AttachmentService {
    storage;
    scanner;
    constructor(storage, scanner) {
        this.storage = storage;
        this.scanner = scanner;
    }
    async upload(input) { validateAttachment(input); const stored = await this.storage.put({ name: input.name, contentType: input.contentType, bytes: input.bytes }); return { ...input, id: crypto.randomUUID(), reference: stored.reference, scanState: await this.scanner.scan(stored.reference) }; }
}
//# sourceMappingURL=attachment-service.js.map