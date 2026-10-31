import { Attachment } from '../../domain/attachments/attachment.js';
import { ScanningPort, StoragePort } from '../ports/index.js';
export declare class AttachmentService {
    private readonly storage;
    private readonly scanner;
    constructor(storage: StoragePort, scanner: ScanningPort);
    upload(input: Omit<Attachment, 'id' | 'reference' | 'scanState'> & {
        bytes: Uint8Array;
    }): Promise<Attachment>;
}
