"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeDidStartHook = invokeDidStartHook;
exports.invokeSyncDidStartHook = invokeSyncDidStartHook;
exports.invokeHooksUntilDefinedAndNonNull = invokeHooksUntilDefinedAndNonNull;
const isDefined_js_1 = require("./isDefined.js");
async function invokeDidStartHook(targets, hook) {
    const didEndHooks = (await Promise.all(targets.map((target) => hook(target)))).filter(isDefined_js_1.isDefined);
    didEndHooks.reverse();
    return async (...args) => {
        for (const didEndHook of didEndHooks) {
            didEndHook(...args);
        }
    };
}
function invokeSyncDidStartHook(targets, hook) {
    const didEndHooks = targets
        .map((target) => hook(target))
        .filter(isDefined_js_1.isDefined);
    didEndHooks.reverse();
    return (...args) => {
        for (const didEndHook of didEndHooks) {
            didEndHook(...args);
        }
    };
}
async function invokeHooksUntilDefinedAndNonNull(targets, hook) {
    for (const target of targets) {
        const value = await hook(target);
        if (value != null) {
            return value;
        }
    }
    return null;
}
//# sourceMappingURL=invokeHooks.js.map