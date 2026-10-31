export function bearerToken(header) {
    if (!header?.startsWith('Bearer '))
        return undefined;
    return header.slice('Bearer '.length).trim() || undefined;
}
//# sourceMappingURL=oidc-middleware.js.map