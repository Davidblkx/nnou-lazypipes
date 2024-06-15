import { LazyPipeImpl } from './lazy_pipe.ts';
import type { LazyPipe } from './model.ts';

export function lazyPipe<T, TErr>(defaultError?: (error: unknown) => NonNullable<TErr>): LazyPipe<T, T, TErr> {
    return new LazyPipeImpl([], defaultError);
}
