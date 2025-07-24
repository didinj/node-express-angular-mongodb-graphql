"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalPlugin = internalPlugin;
exports.pluginIsInternal = pluginIsInternal;
function internalPlugin(p) {
    return p;
}
function pluginIsInternal(plugin) {
    return '__internal_plugin_id__' in plugin;
}
//# sourceMappingURL=internalPlugin.js.map