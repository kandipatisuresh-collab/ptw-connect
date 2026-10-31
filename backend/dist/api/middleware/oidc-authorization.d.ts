import { IncomingMessage } from 'node:http';
import { ActorContext } from '../../domain/shared/types.js';
import { OidcVerifier } from '../../infrastructure/identity/oidc-middleware.js';
export declare function authenticatedActor(request: IncomingMessage, verifier: OidcVerifier, correlationId: string): Promise<ActorContext>;
