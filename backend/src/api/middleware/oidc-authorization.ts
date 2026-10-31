import { IncomingMessage } from 'node:http';
import { DomainError } from '../../domain/shared/errors.js';
import { ActorContext } from '../../domain/shared/types.js';
import { actorFromClaims } from './authorization.js';
import { bearerToken, OidcVerifier } from '../../infrastructure/identity/oidc-middleware.js';

export async function authenticatedActor(request: IncomingMessage, verifier: OidcVerifier, correlationId: string): Promise<ActorContext> {
  const token = bearerToken(typeof request.headers.authorization === 'string' ? request.headers.authorization : undefined);
  if (!token) throw new DomainError('UNAUTHORIZED', 'A bearer token is required.');
  return actorFromClaims(await verifier.verify(token), correlationId);
}
