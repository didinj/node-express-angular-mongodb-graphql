import type { KeyValueCache, KeyValueCacheSetOptions } from "./KeyValueCache";
import type { Logger } from "@apollo/utils.logger";
export declare class ErrorsAreMissesCache<V = string, SO extends KeyValueCacheSetOptions = KeyValueCacheSetOptions> implements KeyValueCache<V, SO> {
    private cache;
    private logger?;
    constructor(cache: KeyValueCache<V, SO>, logger?: Logger | undefined);
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, opts?: SO): Promise<void>;
    delete(key: string): Promise<boolean | void>;
}
//# sourceMappingURL=ErrorsAreMissesCache.d.ts.map