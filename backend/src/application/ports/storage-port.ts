export interface StoragePort {
  put(input: { name: string; contentType: string; bytes: Uint8Array }): Promise<{ reference: string; scanRequired: boolean }>;
  get(reference: string): Promise<Uint8Array>;
}
