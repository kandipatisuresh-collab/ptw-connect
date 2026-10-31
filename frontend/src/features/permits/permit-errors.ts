export function permitErrorMessage(error: unknown): string { return error instanceof Error ? error.message : 'The permit operation could not be completed.'; }
