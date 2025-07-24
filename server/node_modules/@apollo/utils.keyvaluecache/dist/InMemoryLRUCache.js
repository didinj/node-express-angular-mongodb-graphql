"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryLRUCache = void 0;
const lru_cache_1 = require("lru-cache");
class InMemoryLRUCache {
    constructor(lruCacheOpts) {
        this.cache = new lru_cache_1.LRUCache({
            sizeCalculation: InMemoryLRUCache.sizeCalculation,
            maxSize: Math.pow(2, 20) * 30,
            ...lruCacheOpts,
        });
    }
    static sizeCalculation(item) {
        if (typeof item === "string") {
            return item.length;
        }
        if (typeof item === "object") {
            return Buffer.byteLength(JSON.stringify(item), "utf8");
        }
        return 1;
    }
    async set(key, value, options) {
        const lruOptions = options
            ? { ...options, ttl: options.ttl ? options.ttl * 1000 : 0 }
            : undefined;
        this.cache.set(key, value, lruOptions);
    }
    async get(key) {
        return this.cache.get(key);
    }
    async delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    keys() {
        return [...this.cache.keys()];
    }
}
exports.InMemoryLRUCache = InMemoryLRUCache;
//# sourceMappingURL=InMemoryLRUCache.js.map