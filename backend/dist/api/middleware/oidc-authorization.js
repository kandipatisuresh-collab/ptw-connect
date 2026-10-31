import { DomainError } from '../../domain/shared/errors.js';
import { actorFromClaims } from './authorization.js';
import { bearerToken } from '../../infrastructure/identity/oidc-middleware.js';
export async function authenticatedActor(request, verifier, correlationId) {
    const token = bearerToken(typeof request.headers.authorization === 'string' ? request.headers.authorization : undefined);
    if (!token)
        throw new DomainError('UNAUTHORIZED', 'A bearer token is required.');
    return actorFromClaims(await verifier.verify(token), correlationId);
}
//# sourceMappingURL=oidc-authorization.js.map