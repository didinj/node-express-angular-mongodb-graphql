"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCoreSchemaHash = computeCoreSchemaHash;
const utils_createhash_1 = require("@apollo/utils.createhash");
function computeCoreSchemaHash(schema) {
    return (0, utils_createhash_1.createHash)('sha256').update(schema).digest('hex');
}
//# sourceMappingURL=computeCoreSchemaHash.js.map