export type ChecklistResponse = 'YES' | 'NO' | 'N/A';
export interface ChecklistItem {
    id: string;
    question: string;
    mandatory: boolean;
}
export interface ChecklistAnswer {
    itemId: string;
    response: ChecklistResponse;
    comment?: string;
}
export declare function validateChecklist(items: readonly ChecklistItem[], answers: readonly ChecklistAnswer[]): void;
