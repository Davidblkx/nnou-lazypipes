import type { LazyPipe, LazyPipeAsync } from '../model.ts';
import { LazyPipeImpl } from '../lazy_pipe.ts';
import { LazyPipeAsyncImpl } from '../lazy_pipe_async.ts';

/**
 * Merge two pipes into one.
 *
 * @param entryPipe pipe that defines the first part of the new pipe
 * @param exitPipe  pipe that defines the second part of the new pipe
 *
 * @example
 * ```typescript
 * const pipe1 = forSteps(
 *   map((value: number) => BigInt(value + 1)),
 * ).catchDefault('an error').create();
 *
 * const pipe2 = forSteps(
 *   map((value: bigint) => value.toString()),
 * ).create();
 *
 * const pipe = merge(pipe1, pipe2);
 *
 * assertResultOkEqual(pipe.run(1), '2');
 */
export function merge<TIn, TMid, TOut, TErr>(
    entryPipe: LazyPipe<TIn, TMid, TErr>,
    exitPipe: LazyPipe<TMid, TOut, TErr>,
): LazyPipe<TIn, TOut, TErr>;
/**
 * Merge two pipes into one.
 *
 * @param entryPipe pipe that defines the first part of the new pipe
 * @param exitPipe  pipe that defines the second part of the new pipe
 */
export function merge<TIn, TMid, TOut, TErr>(
    entryPipe: LazyPipe<TIn, TMid, TErr>,
    exitPipe: LazyPipeAsync<TMid, TOut, TErr>,
): LazyPipeAsync<TIn, TOut, TErr>;
/**
 * Merge two pipes into one.
 *
 * @param entryPipe pipe that defines the first part of the new pipe
 * @param exitPipe  pipe that defines the second part of the new pipe
 */
export function merge<TIn, TMid, TOut, TErr>(
    entryPipe: LazyPipeAsync<TIn, TMid, TErr>,
    exitPipe: LazyPipe<TMid, TOut, TErr>,
): LazyPipeAsync<TIn, TOut, TErr>;
/**
 * Merge two pipes into one.
 *
 * @param entryPipe pipe that defines the first part of the new pipe
 * @param exitPipe  pipe that defines the second part of the new pipe
 */
export function merge<TIn, TMid, TOut, TErr>(
    entryPipe: LazyPipeAsync<TIn, TMid, TErr>,
    exitPipe: LazyPipeAsync<TMid, TOut, TErr>,
): LazyPipeAsync<TIn, TOut, TErr>;
export function merge<TIn, TMid, TOut, TErr>(
    entryPipe: LazyPipe<TIn, TMid, TErr> | LazyPipeAsync<TIn, TMid, TErr>,
    exitPipe: LazyPipe<TMid, TOut, TErr> | LazyPipeAsync<TMid, TOut, TErr>,
): LazyPipe<TIn, TOut, TErr> | LazyPipeAsync<TIn, TOut, TErr> {
    const catchErr = entryPipe.errHandler || exitPipe.errHandler;

    if (!entryPipe.isAsync && !exitPipe.isAsync) {
        return new LazyPipeImpl([
            ...entryPipe.steps,
            ...exitPipe.steps,
        ], catchErr) as LazyPipe<TIn, TOut, TErr>;
    }

    return new LazyPipeAsyncImpl([
        ...entryPipe.steps,
        ...exitPipe.steps,
    ], catchErr) as LazyPipeAsync<TIn, TOut, TErr>;
}
