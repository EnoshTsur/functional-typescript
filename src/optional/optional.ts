import {Consumer, Function1, Predicate, Supplier} from "../functions/functions";
import {requireNonNull} from "../objects/objects";

class Optional<T> {
	protected value: T | undefined;

	private constructor(value?: T) {
		this.value = value;
	}

	static of = <T>(value: T) => new Optional(requireNonNull(value));
	
	static empty = <T>() => new Optional<T>();

	static ofNullable = <T>(value?: T) => new Optional<T>(value);

	get = () => requireNonNull(this.value, "No such element");

	isPresent = () => this.value != null;

	ifPresent = (consumer: Consumer<T>) => {
		requireNonNull(consumer);
		if (this.value != null) {
			consumer(this.value);
		}
	}

	filter = (predicate: Predicate<T>) => {
		requireNonNull(predicate);
		if (!this.isPresent()) {
			return Optional.empty<T>();
		}
		return predicate(this.value!)
		  ? Optional.of<T>(this.value!)
		  : Optional.empty<T>();
	}

	map = <R>(mapper: Function1<T, R>) => {
		requireNonNull(mapper);
		if (!this.isPresent()) {
			return Optional.empty<R>();
		}
		return Optional.of<R>(mapper(this.value!));
	}

	flatMap = <R>(mapper: Function1<T, Optional<R>>) => {
		if (!this.isPresent()) {
			return Optional.empty<R>();
		}
		return requireNonNull(mapper(this.value!));
	}

	orElse = (other: T) => this.value != null ? this.value! : other;

	orElseGet = (other: Supplier<T>) => this.value != null ? this.value : other();

	orElseThrow = (err: string) => {
		if (!this.isPresent()) {
			throw Error(err);
		}
		return this.value;
	}
}

export default Optional;

