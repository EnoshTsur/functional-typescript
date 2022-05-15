"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negate = void 0;
const negate = (predicate) => (t) => !predicate(t);
exports.negate = negate;
