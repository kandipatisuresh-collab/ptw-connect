export interface User {
    id: string;
    identitySubject: string;
    displayName: string;
    active: boolean;
}
export interface Role {
    id: string;
    name: string;
    permissions: readonly string[];
}
export interface Plant {
    id: string;
    code: string;
    name: string;
}
export interface Area {
    id: string;
    plantId: string;
    code: string;
    name: string;
}
export interface PermitType {
    id: string;
    code: string;
    name: string;
    active: boolean;
    configuration: Record<string, unknown>;
}
