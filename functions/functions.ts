export type Consumer<T> = (t: T) => void;

export type BiConsumer<T, U> = (t: T, u: U) => void;

export type Predicate<T> = (t: T) => boolean;

export type BiPredicate<T, U> = (t: T, u: U) => boolean;

export type Runnable = () => void;

export type Supplier<T> = () => T;

export type Function1<T, R> = (t: T) => R;

export type Function2<T, U, R> = (t: T, u: U) => R;

export type Function3<T, U, E, R> = (t: T, u: U, e: E) => R;

export type Function4<T, U, E, B, R> = (t: T, u: U, e: E, b: B) => R;

export type Function5<T, U, E, B, D, R> = (t: T, u: U, e: E, b: B, d: D) => R;

export const negate = <T>(predicate: Predicate<T>) => (t: T) => !predicate(t);

