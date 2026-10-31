export interface Repository<T, Id = string> {
    get(id: Id): Promise<T | undefined>;
    save(value: T): Promise<T>;
    list(): Promise<readonly T[]>;
}
