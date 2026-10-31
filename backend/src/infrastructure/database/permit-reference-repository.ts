import { Area, PermitType, Plant, Role, User } from '../../domain/identity/models.js';
import { initialPermitTypes } from '../../domain/permits/permit-type.js';
export class PermitReferenceRepository {
  readonly users: User[] = []; readonly roles: Role[] = []; readonly plants: Plant[] = []; readonly areas: Area[] = []; readonly permitTypes: PermitType[] = [...initialPermitTypes];
}
