"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireNonNull = void 0;
const requireNonNull = (value, message) => {
    if (value == null) {
        throw Error(message || 'Value is null');
    }
    return value;
};
exports.requireNonNull = requireNonNull;
