export interface KeyValueCache<V = string, SO extends KeyValueCacheSetOptions = KeyValueCacheSetOptions> {
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, options?: SO): Promise<void>;
    delete(key: string): Promise<boolean | void>;
}
export interface KeyValueCacheSetOptions {
    ttl?: number | null;
}
//# sourceMappingURL=KeyValueCache.d.ts.map