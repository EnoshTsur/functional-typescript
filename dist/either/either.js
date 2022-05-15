"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Left = exports.Right = void 0;
const functions_1 = require("../functions/functions");
const objects_1 = require("../objects/objects");
const optional_1 = __importDefault(require("../optional/optional"));
class Either {
    constructor() {
        this.getOrElseGet = (other) => {
            (0, objects_1.requireNonNull)(other, 'Other is null');
            if (this.isRight()) {
                return this.get();
            }
            return other(this.getLeft());
        };
        this.orElseRun = (action) => {
            (0, objects_1.requireNonNull)(action, 'Action is null');
            if (this.isLeft()) {
                action(this.getLeft());
            }
        };
        this.getOrElseThrow = (errorFunction) => {
            (0, objects_1.requireNonNull)(errorFunction);
            if (this.isRight()) {
                return this.get();
            }
            throw Error(errorFunction(this.getLeft()));
        };
        this.recoverWith = (recoverFunction) => {
            (0, objects_1.requireNonNull)(recoverFunction);
            if (this.isLeft()) {
                return recoverFunction(this.getLeft());
            }
            return this;
        };
        this.recover = (recoverFunction) => {
            (0, objects_1.requireNonNull)(recoverFunction);
            if (this.isLeft()) {
                return Either.right(recoverFunction(this.getLeft()));
            }
            return this;
        };
        this.swap = () => {
            if (this.isRight()) {
                return Either.left(this.get());
            }
            return Either.right(this.getLeft());
        };
        this.flatMap = (mapper) => {
            (0, objects_1.requireNonNull)(mapper);
            if (this.isRight()) {
                return mapper(this.get());
            }
            return Either.left(this.getLeft());
        };
        this.map = (mapper) => {
            (0, objects_1.requireNonNull)(mapper);
            if (this.isRight()) {
                return Either.right(mapper(this.get()));
            }
            return Either.left(this.getLeft());
        };
        this.filter = (predicate) => {
            (0, objects_1.requireNonNull)(predicate);
            if (this.isLeft() || !predicate(this.get())) {
                return optional_1.default.empty();
            }
            return optional_1.default.of(this.get());
        };
        this.filterNot = (predicate) => {
            (0, objects_1.requireNonNull)(predicate);
            return this.filter((0, functions_1.negate)(predicate));
        };
        this.filterOrElse = (predicate, supplier) => {
            (0, objects_1.requireNonNull)(predicate);
            (0, objects_1.requireNonNull)(supplier);
            if (this.getLeft() || !predicate(this.get())) {
                return optional_1.default.ofNullable(supplier());
            }
            return optional_1.default.of(this.get());
        };
        this.transform = (transformer) => {
            (0, objects_1.requireNonNull)(transformer);
            return transformer(this);
        };
        this.peekBoth = (leftAction, rightAction) => {
            (0, objects_1.requireNonNull)(leftAction);
            (0, objects_1.requireNonNull)(rightAction);
            if (this.isLeft()) {
                leftAction(this.getLeft());
            }
            else {
                rightAction(this.get());
            }
            return this;
        };
        this.peek = (rightAction) => {
            (0, objects_1.requireNonNull)(rightAction);
            if (this.isRight()) {
                rightAction(this.get());
            }
            return this;
        };
        this.peekLeft = (leftAction) => {
            (0, objects_1.requireNonNull)(leftAction);
            if (this.isLeft()) {
                leftAction(this.getLeft());
            }
            return this;
        };
        this.fold = (leftMapper, rightMapper) => {
            (0, objects_1.requireNonNull)(leftMapper);
            (0, objects_1.requireNonNull)(rightMapper);
            if (this.isRight()) {
                return rightMapper(this.get());
            }
            return leftMapper(this.getLeft());
        };
        this.isEmpty = () => this.isLeft();
        this.orElse = (other) => {
            (0, objects_1.requireNonNull)(other);
            return this.isRight() ? this : other;
        };
        this.orElseGet = (supplier) => {
            (0, objects_1.requireNonNull)(supplier);
            return this.isRight() ? this : supplier();
        };
    }
}
Either.right = (value) => new Right(value);
Either.left = (value) => new Left(value);
class Right extends Either {
    constructor(value) {
        super();
        this.get = () => this.value;
        this.getLeft = () => {
            throw Error('No such element getLeft on Right');
        };
        this.isLeft = () => false;
        this.isRight = () => true;
        this.value = value;
    }
}
exports.Right = Right;
class Left extends Either {
    constructor(value) {
        super();
        this.get = () => {
            throw Error('No such element get on Left');
        };
        this.getLeft = () => this.value;
        this.isLeft = () => true;
        this.isRight = () => false;
        this.value = value;
    }
}
exports.Left = Left;
exports.default = Either;
