import { Supplier, Runnable, Consumer, Predicate, negate, Function1 } from '../functions/functions';
import { requireNonNull } from '../objects/objects';
import Optional from '../optional/optional';
import Either from '../either/either';

abstract class Try<T> {
	
	static of = <T>(supplier: Supplier<T>) => {
		requireNonNull(supplier);
		try {
			return new Success<T>(supplier());
		} catch (error) {
			return new Failure<T>(error);
		}
	}

	static run = <T>(runnable: Runnable) => {
		requireNonNull(runnable);
		try {
			runnable();
			return new Success<T>({} as T);
		} catch (error) {
			return new Failure<T>(error);
		}
	}

	static sequence = <T>(values: Iterable<Try<T>>) => {
		requireNonNull(values);
		const vector = [];
		for (const value of values) {
			if(value.isFailure()) {
				return Try.failure<T>(value.getCause());
			}
			vector.push(value.get());
		}
		return Try.success<T[]>(vector);

	}

	static success = <T>(value: T) => new Success<T>(value);

	static failure = <T>(value: string) => new Failure<T>(value);

	andThenConsume = (consumer: Consumer<T>) => {
		requireNonNull(consumer);
		if (this.isFailure()) {
			return new Failure<T>(this.getCause());
		}
		try {
			consumer(this.get());
			return new Success<T>(this.get());
		} catch (error) {
			return new Failure<T>(error);
		}
	}

	andThenRun = (runnable: Runnable) => {
		requireNonNull(runnable);
		if (this.isFailure()) {
			return new Failure<T>(this.getCause());
		}
		try {
			runnable();
			return new Success<T>(this.get());
		} catch (error) {
			return new Failure<T>(error);
		}
	}

	filter = (predicate: Predicate<T>, errorSuplier?: Supplier<string>) => {
		requireNonNull(predicate);
		if (this.isFailure()) {
			return new Failure<T>(this.getCause());
		}
		try {
			if (predicate(this.get())) {
				return new Success<T>(this.get());
			}
			const message = Optional.ofNullable(errorSuplier)
			  .map((supplier) => supplier())
			  .orElse('predicate failure');
			
			  return new Failure<T>(message);
		} catch (error) {
			return new Failure<T>(error);
		}
	}

	filterNot = (predicate: Predicate<T>, errorSuplier?: Supplier<string>) => {
		requireNonNull(predicate);
		return this.filter(negate(predicate), errorSuplier);
	}

	flatMap = <U>(mapper: Function1<T, Try<U>>): Failure<U> | Success<U> => {
		requireNonNull(mapper);
		if (this.isFailure()) {
			return new Failure<U>(this.getCause());
		}
		try {
			return mapper(this.get()) as Success<U>;
		} catch (error) {
			return new Failure<U>(error);
		}
	}

	map = <U>(mapper: Function1<T, U>) => {
		requireNonNull(mapper);
		if (this.isFailure()) {
			return new Failure<U>(this.getCause());
		}
		try {
			return new Success<U>(mapper(this.get()));
		} catch (error) {
			return new Failure<U>(error);
		}
	}

	onFailure = (consumer: Consumer<string>) => {
		requireNonNull(consumer);
		if (this.isFailure()) {
			consumer(this.getCause());
			return new Failure<T>(this.getCause());
		}
		return new Success<T>(this.get());
	}


	onSuccess = (consumer: Consumer<T>) => {
		requireNonNull(consumer);
		if (this.isSuccess()) {
			consumer(this.get());
			return new Success<T>(this.get());
		}
		return new Failure<T>(this.getCause());
	}

	orElseTry = (other: Try<T>) => {
		requireNonNull(other);
		return this.isSuccess() ? this : other;
	}

	orElseGet = (other: Supplier<Try<T>>) => {
		requireNonNull(other);
		return this.isSuccess() ? this : other();
	}

	getOrElseGet = (other: Function1<string, T>) => {
		requireNonNull(other);
		return this.isFailure() ? other(this.getCause()) : this.get();
	}

	orElseRun = (consumer: Consumer<string>) => {
		requireNonNull(consumer);
		if (this.isFailure()) {
			consumer(this.getCause());
		}
	}

	getOrElseThrow = (errorProvider: Function1<string, string>) => {
		requireNonNull(errorProvider);
		if (this.isFailure()) {
			throw Error(errorProvider(this.getCause()));
		}
		return this.get();
	}

	fold = <R>(ifFail: Function1<string, R>, mapper: Function1<T, R>) => {
		requireNonNull(ifFail);
		requireNonNull(mapper);
		if (this.isFailure()) {
			return ifFail(this.getCause());
		}
		return mapper(this.get());
	}

	peek = (errorConsumer: Consumer<string>, valueConsumer: Consumer<T>) => {
		requireNonNull(errorConsumer);
		requireNonNull(valueConsumer);
		if (this.isFailure()) {
			errorConsumer(this.getCause());
			return new Failure<T>(this.getCause());
		}
		valueConsumer(this.get());
		return new Success<T>(this.get());
	}

	toEither = () => {
		if (this.isFailure()) {
			return Either.left<string, T>(this.getCause());
		}
		return Either.right<string, T>(this.get());
	}

	transform = <U>(transformer: Function1<Try<T>, U>) => {
		requireNonNull(transformer);
		return transformer(this);
	}

	andFinally = (runnable: Runnable) => {
		requireNonNull(runnable);
		try {
			runnable();
			return new Success<T>(this.get());
		} catch (error) {
			return new Failure<T>(this.getCause());
		}
	}

	* iterator() {
		if (this.isSuccess()) {
			yield this.get();
		}
	}

	abstract getCause: () => string;

	abstract get: () => T;

	abstract isFailure: () => boolean;

	abstract isSuccess: () => boolean;

	abstract isEmpty: () => boolean;
	
}

class Success<T> extends Try<T> {

	protected value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	override get = () => this.value;

	override getCause = () => {
		throw Error('unsupported operation getCause on success');
	}

	override isEmpty = () => false;

	override isFailure = () => false;

	override isSuccess = () => true;
}


class Failure<T> extends Try<T> {

	protected error: string;

	constructor(error: string) {
		super();
		this.error = error;
	}

	override get = () => {
		throw Error('unsupported operation get on failure');
	}

	override getCause = () => this.error; 

	override isEmpty = () => true;

	override isFailure = () => true;

	override isSuccess = () => false;
}

export default Try;

