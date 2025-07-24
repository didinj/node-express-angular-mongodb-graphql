import type http from 'http';
import https from 'https';
export declare class Stopper {
    private server;
    private requestCountPerSocket;
    private stopped;
    constructor(server: http.Server | https.Server);
    stop(hardDestroyAbortSignal?: AbortSignal): Promise<boolean>;
}
//# sourceMappingURL=stoppable.d.ts.map