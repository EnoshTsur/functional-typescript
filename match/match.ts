import {Function1, Predicate, Supplier} from '../functions/functions';

class Match<T, R> {
	protected value: T;
	protected result: R | undefined;

	private constructor(value: T, result?: R) {
		this.value = value;
		this.result = result;
	}

	static of = <T, R>(value: T) => new Match<T, R>(value);

	when = (predicate: T | Predicate<T>, resolver: R | Function1<T, R>): Match<T, R> => {
		if (this.result != null) {
			return this;
		}

		const passed = typeof predicate === 'function'
			? (<Predicate<T>>predicate)(this.value)
			: predicate === this.value;

		const newResult = typeof resolver === 'function'
			? () => (<Function1<T, R>>resolver)(this.value)
			: () => resolver;

		if (passed) {
			return new Match<T, R>(this.value, newResult());
		}
		return new Match<T, R>(this.value, this.result);
	}

	orElse = (other: R): R => this.result == null ? other : this.result;

	orElseGet = (supplier: Supplier<R>): R => this.result == null ? supplier() : this.result
}

export default Match;

