"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginDrainHttpServer = ApolloServerPluginDrainHttpServer;
const stoppable_js_1 = require("./stoppable.js");
function ApolloServerPluginDrainHttpServer(options) {
    const stopper = new stoppable_js_1.Stopper(options.httpServer);
    return {
        async serverWillStart() {
            return {
                async drainServer() {
                    const stopGracePeriodMillis = options.stopGracePeriodMillis ?? 10_000;
                    const signal = AbortSignal.timeout(stopGracePeriodMillis);
                    await stopper.stop(signal);
                },
            };
        },
    };
}
//# sourceMappingURL=index.js.map