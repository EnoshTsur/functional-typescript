import { Consumer, Function1, negate, Predicate, Supplier } from '../functions/functions';
import { requireNonNull} from '../objects/objects';
import Optional from '../optional/optional';


abstract class Either<L, R> {

	static right = <L, R>(value: R) => new Right<L, R>(value);

	static left = <L, R>(value: L) => new Left<L, R>(value);

	abstract get: () => R;

	abstract getLeft: () => L;

	abstract isLeft: () => boolean;

	abstract isRight: () => boolean;

	getOrElseGet = (other: Function1<L, R>) => {
		requireNonNull(other, 'Other is null');
		if (this.isRight()) {
			return this.get();
		}
		return other(this.getLeft());
	}

	orElseRun = (action: Consumer<L>) => {
		requireNonNull(action, 'Action is null')
		if (this.isLeft()) {
			action(this.getLeft());
		}
	}

	getOrElseThrow = (errorFunction: Function1<L, string>) => {
		requireNonNull(errorFunction);
		if (this.isRight()) {
			return this.get();
		}
		throw Error(errorFunction(this.getLeft()));
	}

	recoverWith = (recoverFunction: Function1<L, Either<L, R>>) => {
		requireNonNull(recoverFunction);
		if (this.isLeft()) {
			return recoverFunction(this.getLeft());
		}
		return this;
	}

	recover = (recoverFunction: Function1<L, R>) => {
		requireNonNull(recoverFunction);
		if (this.isLeft()) {
			return Either.right<L, R>(recoverFunction(this.getLeft()));
		}
		return this;
	}

	swap = () => {
		if (this.isRight()) {
			return Either.left<R, L>(this.get());
		}
		return Either.right<R, L>(this.getLeft());
	}

	flatMap = <U>(mapper: Function1<R, Either<L, U>>): Either<L, U> => {
		requireNonNull(mapper);
		if (this.isRight()) {
			return mapper(this.get());
		}
		return Either.left<L, U>(this.getLeft());
	}

	map = <U>(mapper: Function1<R, U>) => {
		requireNonNull(mapper);
		if (this.isRight()) {
			return Either.right<L, U>(mapper(this.get()));
		}
		return Either.left<L, U>(this.getLeft());
	}

	filter = (predicate: Predicate<R>) => {
		requireNonNull(predicate);
		if (this.isLeft() || !predicate(this.get())) {
			return Optional.empty<R>();
		}
		return Optional.of<R>(this.get());
	}

	filterNot = (predicate: Predicate<R>) => {
		requireNonNull(predicate);
		return this.filter(negate(predicate));
	}

	filterOrElse = (predicate: Predicate<R>, supplier: Supplier<R>) => {
		requireNonNull(predicate);
		requireNonNull(supplier);
		if (this.getLeft() || !predicate(this.get())) {
			return Optional.ofNullable<R>(supplier());
		}
		return Optional.of<R>(this.get());
	}

	transform = <U>(transformer: Function1<Either<L, R>, U>) => {
		requireNonNull(transformer);
		return transformer(this);
	}

	peekBoth = (leftAction: Consumer<L>, rightAction: Consumer<R>) => {
		requireNonNull(leftAction);
		requireNonNull(rightAction);
		if (this.isLeft()){
			leftAction(this.getLeft());
		} else {
			rightAction(this.get());
		}
		return this;
	}

	peek = (rightAction: Consumer<R>) => {
		requireNonNull(rightAction);
		if (this.isRight()) {
			rightAction(this.get());
		}
		return this;
	}

	peekLeft = (leftAction: Consumer<L>) => {
		requireNonNull(leftAction);
		if (this.isLeft()) {
			leftAction(this.getLeft());
		}
		return this;
	}

	fold = <U>(leftMapper: Function1<L, U>, rightMapper: Function1<R, U>) => {
		requireNonNull(leftMapper);
		requireNonNull(rightMapper);
		if (this.isRight()) {
			return rightMapper(this.get());
		}
		return leftMapper(this.getLeft());
	}

	isEmpty = () => this.isLeft();

	orElse = (other: Either<L, R>) => {
		requireNonNull(other);
		return this.isRight() ? this : other;
	}

	orElseGet = (supplier: Supplier<Either<L, R>>) => {
		requireNonNull(supplier);
		return this.isRight()? this : supplier();
	}

}

export class Right<L, R> extends Either<L, R> {

	protected value: R;

	constructor(value: R) {
		super();
		this.value = value;
	}

	override get = () => this.value;

	override getLeft = () => {
		throw Error('No such element getLeft on Right');
	}

	override isLeft = () => false;

	override isRight = () => true;
}


export class Left<L, R> extends Either<L, R> {

	protected value: L;

	constructor(value: L) {
		super();
		this.value = value;
	}

	override get = () => {
		throw Error('No such element get on Left');
	}

	override getLeft = () => this.value;

	override isLeft = () => true;
	
	override isRight = () => false;
}

export default Either;

