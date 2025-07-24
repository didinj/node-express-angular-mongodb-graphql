"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlForHttpServer = urlForHttpServer;
const url_1 = require("url");
function urlForHttpServer(httpServer) {
    const { address, port } = httpServer.address();
    const hostname = address === '' || address === '::' ? 'localhost' : address;
    return (0, url_1.format)({
        protocol: 'http',
        hostname,
        port,
        pathname: '/',
    });
}
//# sourceMappingURL=urlForHttpServer.js.map