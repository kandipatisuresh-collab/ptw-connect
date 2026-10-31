export interface OidcClaims {
  subject: string;
  roles: readonly string[];
  plantIds: readonly string[];
  areaIds: readonly string[];
}

export interface OidcVerifier {
  verify(token: string): Promise<OidcClaims>;
}

export function bearerToken(header: string | undefined): string | undefined {
  if (!header?.startsWith('Bearer ')) return undefined;
  return header.slice('Bearer '.length).trim() || undefined;
}
