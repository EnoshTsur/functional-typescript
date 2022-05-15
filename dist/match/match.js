"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Match {
    constructor(value, result) {
        this.when = (predicate, resolver) => {
            if (this.result != null) {
                return this;
            }
            const passed = typeof predicate === 'function'
                ? predicate(this.value)
                : predicate === this.value;
            const newResult = typeof resolver === 'function'
                ? () => resolver(this.value)
                : () => resolver;
            if (passed) {
                return new Match(this.value, newResult());
            }
            return new Match(this.value, this.result);
        };
        this.orElse = (other) => this.result == null ? other : this.result;
        this.orElseGet = (supplier) => this.result == null ? supplier() : this.result;
        this.value = value;
        this.result = result;
    }
}
Match.of = (value) => new Match(value);
exports.default = Match;
