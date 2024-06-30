import type { ErrorHandler, LazyPipe, LazyPipeAsync } from '../model.ts';
import { ok } from '@nnou/result';
import { map, mapAsync } from './map.ts';
import { LazyPipeImpl } from '../lazy_pipe.ts';
import { LazyPipeAsyncImpl } from '../lazy_pipe_async.ts';

/**
 * Takes two pipes and concatenates them into a new pipe where the output is a tuple of the outputs of the two pipes.
 *
 * @param pipe1 first pipe
 * @param pipe2 second pipe
 * @param errHandler error handler to use in the new pipe
 *
 * @example
 * ```ts
 * const pipe = emptyPipe<number, number>()
 *    .next(map((v) => v + 1));
 *
 * const subject = concat(pipe, pipe)
 *   .next(map(([v1, v2]) => v1 + v2));
 *
 * const result = subject.run([1, 2]); // Ok(5)
 * ```
 */
export function concat<TIn1, TIn2, TOut1, TOut2, TErr>(
    pipe1: LazyPipe<TIn1, TOut1, TErr>,
    pipe2: LazyPipe<TIn2, TOut2, TErr>,
    errHandler?: ErrorHandler<TErr>,
): LazyPipe<[TIn1, TIn2], [TOut1, TOut2], TErr>;
/**
 * Takes two pipes and concatenates them into a new pipe where the output is a tuple of the outputs of the two pipes.
 *
 * @param pipe1 first pipe
 * @param pipe2 second pipe
 * @param errHandler error handler to use in the new pipe
 */
export function concat<TIn1, TIn2, TOut1, TOut2, TErr>(
    pipe1: LazyPipe<TIn1, TOut1, TErr>,
    pipe2: LazyPipeAsync<TIn2, TOut2, TErr>,
    errHandler?: ErrorHandler<TErr>,
): LazyPipeAsync<[TIn1, TIn2], [TOut1, TOut2], TErr>;
/**
 * Takes two pipes and concatenates them into a new pipe where the output is a tuple of the outputs of the two pipes.
 *
 * @param pipe1 first pipe
 * @param pipe2 second pipe
 * @param errHandler error handler to use in the new pipe
 */
export function concat<TIn1, TIn2, TOut1, TOut2, TErr>(
    pipe1: LazyPipeAsync<TIn1, TOut1, TErr>,
    pipe2: LazyPipe<TIn2, TOut2, TErr>,
    errHandler?: ErrorHandler<TErr>,
): LazyPipeAsync<[TIn1, TIn2], [TOut1, TOut2], TErr>;
/**
 * Takes two pipes and concatenates them into a new pipe where the output is a tuple of the outputs of the two pipes.
 *
 * @param pipe1 first pipe
 * @param pipe2 second pipe
 * @param errHandler error handler to use in the new pipe
 */
export function concat<TIn1, TIn2, TOut1, TOut2, TErr>(
    pipe1: LazyPipeAsync<TIn1, TOut1, TErr>,
    pipe2: LazyPipeAsync<TIn2, TOut2, TErr>,
    errHandler?: ErrorHandler<TErr>,
): LazyPipeAsync<[TIn1, TIn2], [TOut1, TOut2], TErr>;
export function concat<TIn1, TIn2, TOut1, TOut2, TErr>(
    pipe1: LazyPipe<TIn1, TOut1, TErr> | LazyPipeAsync<TIn1, TOut1, TErr>,
    pipe2: LazyPipe<TIn2, TOut2, TErr> | LazyPipeAsync<TIn2, TOut2, TErr>,
    errHandler?: ErrorHandler<TErr>,
): LazyPipe<[TIn1, TIn2], [TOut1, TOut2], TErr> | LazyPipeAsync<[TIn1, TIn2], [TOut1, TOut2], TErr> {
    if (!pipe1.isAsync && !pipe2.isAsync) {
        return new LazyPipeImpl<[TIn1, TIn2], [TOut1, TOut2], TErr>([
            map(([in1, in2]: [NonNullable<TIn1>, NonNullable<TIn2>]) => {
                const res1 = pipe1.run(in1);
                if (!res1.ok) return res1;

                const res2 = pipe2.run(in2);
                if (!res2.ok) return res2;

                return ok([res1.value, res2.value] as [TOut1, TOut2]);
            }),
        ], errHandler);
    }

    return new LazyPipeAsyncImpl<[TIn1, TIn2], [TOut1, TOut2], TErr>([
        mapAsync(async ([in1, in2]: [NonNullable<TIn1>, NonNullable<TIn2>]) => {
            const res1 = await pipe1.run(in1);
            if (!res1.ok) return res1;

            const res2 = await pipe2.run(in2);
            if (!res2.ok) return res2;

            return ok([res1.value, res2.value] as [TOut1, TOut2]);
        }),
    ], errHandler);
}
