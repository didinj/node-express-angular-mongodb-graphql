export function makeGatewayGraphQLRequestContext(newRequestContext, server, internals) {
    const request = {};
    if ('query' in newRequestContext.request) {
        request.query = newRequestContext.request.query;
    }
    if ('operationName' in newRequestContext.request) {
        request.operationName = newRequestContext.request.operationName;
    }
    if ('variables' in newRequestContext.request) {
        request.variables = newRequestContext.request.variables;
    }
    if ('extensions' in newRequestContext.request) {
        request.extensions = newRequestContext.request.extensions;
    }
    if (newRequestContext.request.http) {
        const newHttp = newRequestContext.request.http;
        const needQuestion = newHttp.search !== '' && !newHttp.search.startsWith('?');
        request.http = {
            method: newHttp.method,
            url: `https://unknown-url.invalid/${needQuestion ? '?' : ''}${newHttp.search}`,
            headers: new FetcherHeadersForHeaderMap(newHttp.headers),
        };
    }
    const response = {
        http: {
            headers: new FetcherHeadersForHeaderMap(newRequestContext.response.http.headers),
            get status() {
                return newRequestContext.response.http.status;
            },
            set status(newStatus) {
                newRequestContext.response.http.status = newStatus;
            },
        },
    };
    return {
        request,
        response,
        logger: server.logger,
        schema: newRequestContext.schema,
        schemaHash: 'schemaHash no longer exists since Apollo Server 4',
        context: newRequestContext.contextValue,
        cache: server.cache,
        queryHash: newRequestContext.queryHash,
        document: newRequestContext.document,
        source: newRequestContext.source,
        operationName: newRequestContext.operationName,
        operation: newRequestContext.operation,
        errors: newRequestContext.errors,
        metrics: newRequestContext.metrics,
        debug: internals.includeStacktraceInErrorResponses,
        overallCachePolicy: newRequestContext.overallCachePolicy,
        requestIsBatched: newRequestContext.requestIsBatched,
    };
}
class FetcherHeadersForHeaderMap {
    map;
    constructor(map) {
        this.map = map;
    }
    append(name, value) {
        if (this.map.has(name)) {
            this.map.set(name, this.map.get(name) + ', ' + value);
        }
        else {
            this.map.set(name, value);
        }
    }
    delete(name) {
        this.map.delete(name);
    }
    get(name) {
        return this.map.get(name) ?? null;
    }
    has(name) {
        return this.map.has(name);
    }
    set(name, value) {
        this.map.set(name, value);
    }
    entries() {
        return this.map.entries();
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    [Symbol.iterator]() {
        return this.map.entries();
    }
}
//# sourceMappingURL=makeGatewayGraphQLRequestContext.js.map