"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objects_1 = require("../objects/objects");
class Optional {
    constructor(value) {
        this.get = () => (0, objects_1.requireNonNull)(this.value, "No such element");
        this.isPresent = () => this.value != null;
        this.ifPresent = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            if (this.value != null) {
                consumer(this.value);
            }
        };
        this.filter = (predicate) => {
            (0, objects_1.requireNonNull)(predicate);
            if (!this.isPresent()) {
                return Optional.empty();
            }
            return predicate(this.value)
                ? Optional.of(this.value)
                : Optional.empty();
        };
        this.map = (mapper) => {
            (0, objects_1.requireNonNull)(mapper);
            if (!this.isPresent()) {
                return Optional.empty();
            }
            return Optional.of(mapper(this.value));
        };
        this.flatMap = (mapper) => {
            if (!this.isPresent()) {
                return Optional.empty();
            }
            return (0, objects_1.requireNonNull)(mapper(this.value));
        };
        this.orElse = (other) => this.value != null ? this.value : other;
        this.orElseGet = (other) => this.value != null ? this.value : other();
        this.orElseThrow = (err) => {
            if (!this.isPresent()) {
                throw Error(err);
            }
            return this.value;
        };
        this.value = value;
    }
}
Optional.of = (value) => new Optional((0, objects_1.requireNonNull)(value));
Optional.empty = () => new Optional();
Optional.ofNullable = (value) => new Optional(value);
exports.default = Optional;
