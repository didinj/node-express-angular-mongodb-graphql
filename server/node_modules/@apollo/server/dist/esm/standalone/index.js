import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { parse as urlParse } from 'url';
import { ApolloServerPluginDrainHttpServer } from '../plugin/drainHttpServer/index.js';
import { urlForHttpServer } from '../utils/urlForHttpServer.js';
import { HeaderMap } from '../utils/HeaderMap.js';
import finalhandler from 'finalhandler';
export async function startStandaloneServer(server, options) {
    const context = options?.context ?? (async () => ({}));
    const corsHandler = cors();
    const jsonHandler = bodyParser.json({ limit: '50mb' });
    const httpServer = http.createServer((req, res) => {
        const errorHandler = finalhandler(req, res, {
            onerror(err) {
                if (process.env.NODE_ENV !== 'test') {
                    console.error(err.stack || err.toString());
                }
            },
        });
        corsHandler(req, res, (err) => {
            if (err) {
                errorHandler(err);
                return;
            }
            jsonHandler(req, res, (err) => {
                if (err) {
                    errorHandler(err);
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
                    body: 'body' in req ? req.body : undefined,
                };
                server
                    .executeHTTPGraphQLRequest({
                    httpGraphQLRequest,
                    context: () => context({ req, res }),
                })
                    .then(async (httpGraphQLResponse) => {
                    for (const [key, value] of httpGraphQLResponse.headers) {
                        res.setHeader(key, value);
                    }
                    res.statusCode = httpGraphQLResponse.status || 200;
                    if (httpGraphQLResponse.body.kind === 'complete') {
                        res.end(httpGraphQLResponse.body.string);
                        return;
                    }
                    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
                        res.write(chunk);
                    }
                    res.end();
                })
                    .catch((err) => {
                    errorHandler(err);
                });
            });
        });
    });
    server.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer: httpServer }));
    await server.start();
    const listenOptions = options?.listen ?? { port: 4000 };
    await new Promise((resolve) => {
        httpServer.listen(listenOptions, resolve);
    });
    return { url: urlForHttpServer(httpServer) };
}
//# sourceMappingURL=index.js.map