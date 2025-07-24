"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoIntrospection = void 0;
const graphql_1 = require("graphql");
const index_js_1 = require("../errors/index.js");
const NoIntrospection = (context) => ({
    Field(node) {
        if (node.name.value === '__schema' || node.name.value === '__type') {
            context.reportError(new graphql_1.GraphQLError('GraphQL introspection is not allowed by Apollo Server, but the query contained __schema or __type. To enable introspection, pass introspection: true to ApolloServer in production', {
                nodes: [node],
                extensions: {
                    validationErrorCode: index_js_1.ApolloServerValidationErrorCode.INTROSPECTION_DISABLED,
                },
            }));
        }
    },
});
exports.NoIntrospection = NoIntrospection;
//# sourceMappingURL=NoIntrospection.js.map