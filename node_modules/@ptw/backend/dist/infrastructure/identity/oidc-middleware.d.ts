export interface OidcClaims {
    subject: string;
    roles: readonly string[];
    plantIds: readonly string[];
    areaIds: readonly string[];
}
export interface OidcVerifier {
    verify(token: string): Promise<OidcClaims>;
}
export declare function bearerToken(header: string | undefined): string | undefined;
