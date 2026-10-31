export declare function errorResponse(error: unknown, correlationId: string): {
    status: number;
    body: Record<string, unknown>;
};
