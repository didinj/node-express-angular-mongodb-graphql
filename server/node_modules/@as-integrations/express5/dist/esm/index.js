import { parse as urlParse } from 'url';
import { HeaderMap } from '@apollo/server';
export function expressMiddleware(server, options) {
    server.assertStarted('expressMiddleware()');
    const defaultContext = async () => ({});
    const context = options?.context ?? defaultContext;
    return async (req, res) => {
        if (!('body' in req)) {
            res.status(500);
            res.send('`req.body` is not set; this probably means you forgot to set up the ' +
                '`json` middleware before the Apollo Server middleware.');
            return;
        }
        const headers = new HeaderMap();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value !== undefined) {
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
        }
        const httpGraphQLRequest = {
            method: req.method.toUpperCase(),
            headers,
            search: urlParse(req.url).search ?? '',
            body: req.body,
        };
        const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
            httpGraphQLRequest,
            context: () => context({ req, res }),
        });
        for (const [key, value] of httpGraphQLResponse.headers) {
            res.setHeader(key, value);
        }
        res.statusCode = httpGraphQLResponse.status || 200;
        if (httpGraphQLResponse.body.kind === 'complete') {
            res.send(httpGraphQLResponse.body.string);
            return;
        }
        for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
            res.write(chunk);
            if (typeof res.flush === 'function') {
                res.flush();
            }
        }
        res.end();
    };
}
//# sourceMappingURL=index.js.map