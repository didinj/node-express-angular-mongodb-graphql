import { LRUCache } from "lru-cache";
import type { KeyValueCache, KeyValueCacheSetOptions } from "./KeyValueCache";
export type InMemoryLRUCacheSetOptions<V extends {} = string, FC = unknown> = Omit<LRUCache.SetOptions<string, V, FC>, "ttl"> & KeyValueCacheSetOptions;
export declare class InMemoryLRUCache<V extends {} = string, SO extends InMemoryLRUCacheSetOptions<V> = InMemoryLRUCacheSetOptions<V>> implements KeyValueCache<V, SO> {
    private cache;
    constructor(lruCacheOpts?: LRUCache.Options<string, V, any>);
    static sizeCalculation<V extends {}>(item: V): number;
    set(key: string, value: V, options?: SO): Promise<void>;
    get(key: string): Promise<V | undefined>;
    delete(key: string): Promise<boolean>;
    clear(): void;
    keys(): string[];
}
//# sourceMappingURL=InMemoryLRUCache.d.ts.map