"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions/functions");
const objects_1 = require("../objects/objects");
const optional_1 = __importDefault(require("../optional/optional"));
class Lazy {
    constructor(supplier) {
        this.evaluated = false;
        this.filter = (predicate) => {
            (0, objects_1.requireNonNull)(predicate);
            const v = this.get();
            return predicate(v)
                ? optional_1.default.of(v)
                : optional_1.default.empty();
        };
        this.filterNot = (predicate) => {
            (0, objects_1.requireNonNull)(predicate);
            return this.filter((0, functions_1.negate)(predicate));
        };
        this.map = (mapper) => Lazy.of(() => (0, objects_1.requireNonNull)(mapper(this.get())));
        this.peek = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            consumer(this.get());
            return this;
        };
        this.transform = (transformer) => {
            (0, objects_1.requireNonNull)(transformer);
            return transformer(Lazy.of(() => this.get()));
        };
        this.computeValue = () => {
            if (!this.evaluated) {
                this.value = this.supplier();
                this.evaluated = true;
            }
            return this.value;
        };
        this.get = () => this.evaluated ? this.value : this.computeValue();
        this.supplier = supplier;
    }
}
Lazy.of = (supplier) => new Lazy((0, objects_1.requireNonNull)(supplier));
exports.default = Lazy;
