import { LazyPipeImpl } from '../lazy_pipe.ts';
import type { ErrorHandler, LazyPipe } from '../model.ts';

/**
 * Creates a new lazyPipe with no steps
 *
 * @example
 * ```ts
 * const pipe = emptyPipe<number>().next(map(x => x + 1));
 * const value = pipe.run(1); // value === { ok: true, value: 2 }
 * ```
 *
 * @param errorHandler Default error handler
 * @returns A new lazyPipe with no steps
 */
export function emptyPipe<T, TErr = unknown>(errorHandler?: ErrorHandler<TErr>): LazyPipe<T, T, TErr> {
    return new LazyPipeImpl([], errorHandler);
}
