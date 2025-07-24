import { internalPlugin } from '../../internalPlugin.js';
export function ApolloServerPluginDisableSuggestions() {
    return internalPlugin({
        __internal_plugin_id__: 'DisableSuggestions',
        __is_disabled_plugin__: false,
        async requestDidStart() {
            return {
                async validationDidStart() {
                    return async (validationErrors) => {
                        validationErrors?.forEach((error) => {
                            error.message = error.message.replace(/ ?Did you mean(.+?)\?$/, '');
                        });
                    };
                },
            };
        },
    });
}
//# sourceMappingURL=index.js.map