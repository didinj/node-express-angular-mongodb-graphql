"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startStandaloneServer = startStandaloneServer;
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const index_js_1 = require("../plugin/drainHttpServer/index.js");
const urlForHttpServer_js_1 = require("../utils/urlForHttpServer.js");
const HeaderMap_js_1 = require("../utils/HeaderMap.js");
const finalhandler_1 = __importDefault(require("finalhandler"));
async function startStandaloneServer(server, options) {
    const context = options?.context ?? (async () => ({}));
    const corsHandler = (0, cors_1.default)();
    const jsonHandler = body_parser_1.default.json({ limit: '50mb' });
    const httpServer = http_1.default.createServer((req, res) => {
        const errorHandler = (0, finalhandler_1.default)(req, res, {
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
                const headers = new HeaderMap_js_1.HeaderMap();
                for (const [key, value] of Object.entries(req.headers)) {
                    if (value !== undefined) {
                        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
                    }
                }
                const httpGraphQLRequest = {
                    method: req.method.toUpperCase(),
                    headers,
                    search: (0, url_1.parse)(req.url).search ?? '',
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
    server.addPlugin((0, index_js_1.ApolloServerPluginDrainHttpServer)({ httpServer: httpServer }));
    await server.start();
    const listenOptions = options?.listen ?? { port: 4000 };
    await new Promise((resolve) => {
        httpServer.listen(listenOptions, resolve);
    });
    return { url: (0, urlForHttpServer_js_1.urlForHttpServer)(httpServer) };
}
//# sourceMappingURL=index.js.map