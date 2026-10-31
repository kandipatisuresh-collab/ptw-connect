import { Isolation } from '../../domain/isolation/isolation.js';
export declare class IsolationRepository {
    private readonly values;
    save(value: Isolation): Isolation;
    get(id: string): Isolation | undefined;
    forPermit(permitId: string): readonly Isolation[];
}
