"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginDisableSuggestions = ApolloServerPluginDisableSuggestions;
const internalPlugin_js_1 = require("../../internalPlugin.js");
function ApolloServerPluginDisableSuggestions() {
    return (0, internalPlugin_js_1.internalPlugin)({
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