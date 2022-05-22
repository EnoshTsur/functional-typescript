export * as functions from './functions/functions';

import Either from './either/either';
import Optional from './optional/optional';
import Match from './match/match';
import Lazy from './lazy/lazy';
import Try from './try/try';

export type EitherType = typeof Either;
export type OptionalType = typeof Optional;
export type MatchType = typeof Match;
export type LazyType = typeof Lazy;
export type TryType = typeof Try;
