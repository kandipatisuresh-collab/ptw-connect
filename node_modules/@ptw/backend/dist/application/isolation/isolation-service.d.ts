import { Isolation, IsolationStatus } from '../../domain/isolation/isolation.js';
import { IsolationRepository } from '../../infrastructure/database/isolation-repository.js';
export declare class IsolationService {
    private readonly repository;
    constructor(repository: IsolationRepository);
    transition(id: string, next: IsolationStatus): Isolation;
    list(permitId: string): readonly Isolation[];
}
