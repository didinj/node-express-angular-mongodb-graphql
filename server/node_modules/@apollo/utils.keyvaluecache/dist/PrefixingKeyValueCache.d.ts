import type { KeyValueCache, KeyValueCacheSetOptions } from ".";
declare const prefixesAreUnnecessaryForIsolationSymbol: unique symbol;
export declare class PrefixingKeyValueCache<V = string, SO extends KeyValueCacheSetOptions = KeyValueCacheSetOptions> implements KeyValueCache<V, SO> {
    private wrapped;
    private prefix;
    [prefixesAreUnnecessaryForIsolationSymbol]?: true;
    constructor(wrapped: KeyValueCache<V, SO>, prefix: string);
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, options?: SO): Promise<void>;
    delete(key: string): Promise<boolean | void>;
    static prefixesAreUnnecessaryForIsolation<V = string, SO extends KeyValueCacheSetOptions = KeyValueCacheSetOptions>(c: KeyValueCache<V, SO>): boolean;
    static cacheDangerouslyDoesNotNeedPrefixesForIsolation<V = string, SO extends KeyValueCacheSetOptions = KeyValueCacheSetOptions>(c: KeyValueCache<V, SO>): KeyValueCache<V, SO>;
}
export {};
//# sourceMappingURL=PrefixingKeyValueCache.d.ts.map