import {Consumer, Function1, negate, Predicate, Supplier} from '../functions/functions';
import {requireNonNull} from '../objects/objects';
import Optional from '../optional/optional';

class Lazy<T> {

	private evaluated = false;

	protected value: T | undefined;

	protected supplier: Supplier<T>;

	private constructor(supplier: Supplier<T>) {
		this.supplier = supplier;
	}

	static of = <T>(supplier: Supplier<T>) => new Lazy<T>(requireNonNull(supplier));

	filter = (predicate: Predicate<T>) => {
		requireNonNull(predicate);
		const v = this.get()!;
		return predicate(v)
		  ? Optional.of<T>(v)
		  : Optional.empty<T>();
	}

	filterNot = (predicate: Predicate<T>) => {
		requireNonNull(predicate);
		return this.filter(negate(predicate));
	}

	map = <R>(mapper: Function1<T, R>) => Lazy.of<R>(() => requireNonNull(mapper(this.get())));

	peek = (consumer: Consumer<T>) => {
		requireNonNull(consumer);
		consumer(this.get());
		return this;
	}

	transform = <R>(transformer: Function1<Lazy<T>, R>) => {
		requireNonNull(transformer);
		return transformer(Lazy.of<T>(() => this.get()));
	}

	private computeValue = () => {
		if (!this.evaluated) {
			this.value = this.supplier();
			this.evaluated = true;
		}
		return this.value;
	}

	get = () => this.evaluated ? this.value! : this.computeValue()!;

}

export default Lazy;

