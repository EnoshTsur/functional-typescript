"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../functions/functions");
const objects_1 = require("../objects/objects");
const optional_1 = __importDefault(require("../optional/optional"));
const either_1 = __importDefault(require("../either/either"));
class Try {
    constructor() {
        this.andThenConsume = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            if (this.isFailure()) {
                return new Failure(this.getCause());
            }
            try {
                consumer(this.get());
                return new Success(this.get());
            }
            catch (error) {
                return new Failure(`${error}`);
            }
        };
        this.andThenRun = (runnable) => {
            (0, objects_1.requireNonNull)(runnable);
            if (this.isFailure()) {
                return new Failure(this.getCause());
            }
            try {
                runnable();
                return new Success(this.get());
            }
            catch (error) {
                return new Failure(`${error}`);
            }
        };
        this.filter = (predicate, errorSuplier) => {
            (0, objects_1.requireNonNull)(predicate);
            if (this.isFailure()) {
                return new Failure(this.getCause());
            }
            try {
                if (predicate(this.get())) {
                    return new Success(this.get());
                }
                const message = optional_1.default.ofNullable(errorSuplier)
                    .map((supplier) => supplier())
                    .orElse('predicate failure');
                return new Failure(message);
            }
            catch (error) {
                return new Failure(`${error}`);
            }
        };
        this.filterNot = (predicate, errorSuplier) => {
            (0, objects_1.requireNonNull)(predicate);
            return this.filter((0, functions_1.negate)(predicate), errorSuplier);
        };
        this.flatMap = (mapper) => {
            (0, objects_1.requireNonNull)(mapper);
            if (this.isFailure()) {
                return new Failure(this.getCause());
            }
            try {
                return mapper(this.get());
            }
            catch (error) {
                return new Failure(`${error}`);
            }
        };
        this.map = (mapper) => {
            (0, objects_1.requireNonNull)(mapper);
            if (this.isFailure()) {
                return new Failure(this.getCause());
            }
            try {
                return new Success(mapper(this.get()));
            }
            catch (error) {
                return new Failure(`${error}`);
            }
        };
        this.onFailure = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            if (this.isFailure()) {
                consumer(this.getCause());
                return new Failure(this.getCause());
            }
            return new Success(this.get());
        };
        this.onSuccess = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            if (this.isSuccess()) {
                consumer(this.get());
                return new Success(this.get());
            }
            return new Failure(this.getCause());
        };
        this.orElseTry = (other) => {
            (0, objects_1.requireNonNull)(other);
            return this.isSuccess() ? this : other;
        };
        this.orElseGet = (other) => {
            (0, objects_1.requireNonNull)(other);
            return this.isSuccess() ? this : other();
        };
        this.getOrElseGet = (other) => {
            (0, objects_1.requireNonNull)(other);
            return this.isFailure() ? other(this.getCause()) : this.get();
        };
        this.orElseRun = (consumer) => {
            (0, objects_1.requireNonNull)(consumer);
            if (this.isFailure()) {
                consumer(this.getCause());
            }
        };
        this.getOrElseThrow = (errorProvider) => {
            (0, objects_1.requireNonNull)(errorProvider);
            if (this.isFailure()) {
                throw Error(errorProvider(this.getCause()));
            }
            return this.get();
        };
        this.fold = (ifFail, mapper) => {
            (0, objects_1.requireNonNull)(ifFail);
            (0, objects_1.requireNonNull)(mapper);
            if (this.isFailure()) {
                return ifFail(this.getCause());
            }
            return mapper(this.get());
        };
        this.peek = (errorConsumer, valueConsumer) => {
            (0, objects_1.requireNonNull)(errorConsumer);
            (0, objects_1.requireNonNull)(valueConsumer);
            if (this.isFailure()) {
                errorConsumer(this.getCause());
                return new Failure(this.getCause());
            }
            valueConsumer(this.get());
            return new Success(this.get());
        };
        this.toEither = () => {
            if (this.isFailure()) {
                return either_1.default.left(this.getCause());
            }
            return either_1.default.right(this.get());
        };
        this.transform = (transformer) => {
            (0, objects_1.requireNonNull)(transformer);
            return transformer(this);
        };
        this.andFinally = (runnable) => {
            (0, objects_1.requireNonNull)(runnable);
            try {
                runnable();
                return new Success(this.get());
            }
            catch (error) {
                return new Failure(this.getCause());
            }
        };
    }
    *iterator() {
        if (this.isSuccess()) {
            yield this.get();
        }
    }
}
Try.of = (supplier) => {
    (0, objects_1.requireNonNull)(supplier);
    try {
        return new Success(supplier());
    }
    catch (error) {
        return new Failure(`${error}`);
    }
};
Try.run = (runnable) => {
    (0, objects_1.requireNonNull)(runnable);
    try {
        runnable();
        return new Success({});
    }
    catch (error) {
        return new Failure(`${error}`);
    }
};
Try.sequence = (values) => {
    (0, objects_1.requireNonNull)(values);
    const vector = [];
    for (const value of values) {
        if (value.isFailure()) {
            return Try.failure(value.getCause());
        }
        vector.push(value.get());
    }
    return Try.success(vector);
};
Try.success = (value) => new Success(value);
Try.failure = (value) => new Failure(value);
class Success extends Try {
    constructor(value) {
        super();
        this.get = () => this.value;
        this.getCause = () => {
            throw Error('unsupported operation getCause on success');
        };
        this.isEmpty = () => false;
        this.isFailure = () => false;
        this.isSuccess = () => true;
        this.value = value;
    }
}
class Failure extends Try {
    constructor(error) {
        super();
        this.get = () => {
            throw Error('unsupported operation get on failure');
        };
        this.getCause = () => this.error;
        this.isEmpty = () => true;
        this.isFailure = () => true;
        this.isSuccess = () => false;
        this.error = error;
    }
}
exports.default = Try;
