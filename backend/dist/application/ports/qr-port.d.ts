export interface QrPort {
    encode(value: string): Promise<Uint8Array>;
    decode(bytes: Uint8Array): Promise<string>;
}
