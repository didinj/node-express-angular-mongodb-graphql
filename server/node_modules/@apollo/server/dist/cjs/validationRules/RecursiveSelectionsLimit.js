"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_RECURSIVE_SELECTIONS = void 0;
exports.createMaxRecursiveSelectionsRule = createMaxRecursiveSelectionsRule;
const graphql_1 = require("graphql");
const index_js_1 = require("../errors/index.js");
exports.DEFAULT_MAX_RECURSIVE_SELECTIONS = 10_000_000;
class RecursiveSelectionValidationContext {
    selectionCountLimit;
    context;
    fragmentInfo = new Map();
    operationInfo = new Map();
    currentFragment;
    currentOperation;
    fragmentRecursiveSelectionCount = new Map();
    constructor(selectionCountLimit, context) {
        this.selectionCountLimit = selectionCountLimit;
        this.context = context;
    }
    getExecutionDefinitionInfo() {
        if (this.currentFragment !== undefined) {
            let entry = this.fragmentInfo.get(this.currentFragment);
            if (!entry) {
                entry = {
                    selectionCount: 0,
                    fragmentSpreads: new Map(),
                };
                this.fragmentInfo.set(this.currentFragment, entry);
            }
            return entry;
        }
        if (this.currentOperation !== undefined) {
            let entry = this.operationInfo.get(this.currentOperation);
            if (!entry) {
                entry = {
                    selectionCount: 0,
                    fragmentSpreads: new Map(),
                };
                this.operationInfo.set(this.currentOperation, entry);
            }
            return entry;
        }
        return undefined;
    }
    processSelection(fragmentSpreadName) {
        const definitionInfo = this.getExecutionDefinitionInfo();
        if (!definitionInfo) {
            return;
        }
        definitionInfo.selectionCount++;
        if (fragmentSpreadName !== undefined) {
            let spreadCount = (definitionInfo.fragmentSpreads.get(fragmentSpreadName) ?? 0) + 1;
            definitionInfo.fragmentSpreads.set(fragmentSpreadName, spreadCount);
        }
    }
    enterFragment(fragment) {
        this.currentFragment = fragment;
    }
    leaveFragment() {
        this.currentFragment = undefined;
    }
    enterOperation(operation) {
        this.currentOperation = operation;
    }
    leaveOperation() {
        this.currentOperation = undefined;
    }
    computeFragmentRecursiveSelectionsCount(fragment) {
        const cachedCount = this.fragmentRecursiveSelectionCount.get(fragment);
        if (cachedCount === null) {
            return 0;
        }
        if (cachedCount !== undefined) {
            return cachedCount;
        }
        this.fragmentRecursiveSelectionCount.set(fragment, null);
        const definitionInfo = this.fragmentInfo.get(fragment);
        let count = 0;
        if (definitionInfo) {
            count = definitionInfo.selectionCount;
            for (const [fragment, spreadCount] of definitionInfo.fragmentSpreads) {
                count +=
                    spreadCount * this.computeFragmentRecursiveSelectionsCount(fragment);
            }
        }
        this.fragmentRecursiveSelectionCount.set(fragment, count);
        return count;
    }
    reportError(operation) {
        const operationName = operation
            ? `Operation "${operation}"`
            : 'Anonymous operation';
        this.context.reportError(new graphql_1.GraphQLError(`${operationName} recursively requests too many selections.`, {
            nodes: [],
            extensions: {
                validationErrorCode: index_js_1.ApolloServerValidationErrorCode.MAX_RECURSIVE_SELECTIONS_EXCEEDED,
            },
        }));
    }
    checkLimitExceeded() {
        for (const [operation, definitionInfo] of this.operationInfo) {
            let count = definitionInfo.selectionCount;
            for (const [fragment, spreadCount] of definitionInfo.fragmentSpreads) {
                count +=
                    spreadCount * this.computeFragmentRecursiveSelectionsCount(fragment);
            }
            if (count > this.selectionCountLimit) {
                this.reportError(operation);
            }
        }
    }
}
function createMaxRecursiveSelectionsRule(limit) {
    return (context) => {
        const selectionContext = new RecursiveSelectionValidationContext(limit, context);
        return {
            Field() {
                selectionContext.processSelection();
            },
            InlineFragment() {
                selectionContext.processSelection();
            },
            FragmentSpread(node) {
                selectionContext.processSelection(node.name.value);
            },
            FragmentDefinition: {
                enter(node) {
                    selectionContext.enterFragment(node.name.value);
                },
                leave() {
                    selectionContext.leaveFragment();
                },
            },
            OperationDefinition: {
                enter(node) {
                    selectionContext.enterOperation(node.name?.value ?? null);
                },
                leave() {
                    selectionContext.leaveOperation();
                },
            },
            Document: {
                leave() {
                    selectionContext.checkLimitExceeded();
                },
            },
        };
    };
}
//# sourceMappingURL=RecursiveSelectionsLimit.js.map