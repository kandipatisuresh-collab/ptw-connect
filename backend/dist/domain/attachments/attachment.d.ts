export interface Attachment {
    id: string;
    permitId: string;
    category: string;
    name: string;
    size: number;
    contentType: string;
    scanState: 'PENDING' | 'CLEAN' | 'QUARANTINED';
    reference: string;
}
export declare function validateAttachment(input: Pick<Attachment, 'name' | 'size' | 'contentType'>): void;
