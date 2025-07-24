import { GraphQLError, } from 'graphql';
import { ApolloServerValidationErrorCode } from '../errors/index.js';
export const NoIntrospection = (context) => ({
    Field(node) {
        if (node.name.value === '__schema' || node.name.value === '__type') {
            context.reportError(new GraphQLError('GraphQL introspection is not allowed by Apollo Server, but the query contained __schema or __type. To enable introspection, pass introspection: true to ApolloServer in production', {
                nodes: [node],
                extensions: {
                    validationErrorCode: ApolloServerValidationErrorCode.INTROSPECTION_DISABLED,
                },
            }));
        }
    },
});
//# sourceMappingURL=NoIntrospection.js.map