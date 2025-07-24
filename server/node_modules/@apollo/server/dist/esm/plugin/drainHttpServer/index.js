import { Stopper } from './stoppable.js';
export function ApolloServerPluginDrainHttpServer(options) {
    const stopper = new Stopper(options.httpServer);
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