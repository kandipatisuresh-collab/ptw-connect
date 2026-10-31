import { Area, PermitType, Plant, Role, User } from '../../domain/identity/models.js';
export declare class PermitReferenceRepository {
    readonly users: User[];
    readonly roles: Role[];
    readonly plants: Plant[];
    readonly areas: Area[];
    readonly permitTypes: PermitType[];
}
