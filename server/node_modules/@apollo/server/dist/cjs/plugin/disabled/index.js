"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginCacheControlDisabled = ApolloServerPluginCacheControlDisabled;
exports.ApolloServerPluginInlineTraceDisabled = ApolloServerPluginInlineTraceDisabled;
exports.ApolloServerPluginLandingPageDisabled = ApolloServerPluginLandingPageDisabled;
exports.ApolloServerPluginSchemaReportingDisabled = ApolloServerPluginSchemaReportingDisabled;
exports.ApolloServerPluginUsageReportingDisabled = ApolloServerPluginUsageReportingDisabled;
function disabledPlugin(id) {
    const plugin = {
        __internal_plugin_id__: id,
        __is_disabled_plugin__: true,
    };
    return plugin;
}
function ApolloServerPluginCacheControlDisabled() {
    return disabledPlugin('CacheControl');
}
function ApolloServerPluginInlineTraceDisabled() {
    return disabledPlugin('InlineTrace');
}
function ApolloServerPluginLandingPageDisabled() {
    return disabledPlugin('LandingPageDisabled');
}
function ApolloServerPluginSchemaReportingDisabled() {
    return disabledPlugin('SchemaReporting');
}
function ApolloServerPluginUsageReportingDisabled() {
    return disabledPlugin('UsageReporting');
}
//# sourceMappingURL=index.js.map