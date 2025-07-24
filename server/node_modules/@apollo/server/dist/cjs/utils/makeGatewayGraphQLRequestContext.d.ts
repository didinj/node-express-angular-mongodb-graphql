import type { GatewayGraphQLRequestContext } from '@apollo/server-gateway-interface';
import type { ApolloServer, ApolloServerInternals } from '../ApolloServer';
import type { BaseContext, GraphQLRequestContextExecutionDidStart } from '../externalTypes';
export declare function makeGatewayGraphQLRequestContext<TContext extends BaseContext>(newRequestContext: GraphQLRequestContextExecutionDidStart<TContext>, server: ApolloServer<TContext>, internals: ApolloServerInternals<TContext>): GatewayGraphQLRequestContext;
//# sourceMappingURL=makeGatewayGraphQLRequestContext.d.ts.map