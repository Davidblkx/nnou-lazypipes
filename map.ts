// deno-lint-ignore-file no-explicit-any
import type { LazyPipeStep, LazyPipeStepAsync } from './model.ts';
import { ok, isResult, type Result, type ResultAsync } from '@nnou/result';

/**
 * Creates a new step that maps a value to another value.
 * 
 * @example
 * ```ts
 * const pipe = forSteps(
 *  map((value: number) => BigInt(value + 1)),
 *  map(value => value.toString()),
 * ).catchDefault('an error').create();
 * 
 * assertResultOkEqual(pipe.run(1), '2');
 * ```
 * 
 * @param fn mapping function
 * @param error mapping function for errors
 * @returns a new step
 */
export function map<TIn, TOut, TErr = any>(
    fn: (value: TIn) => (NonNullable<TOut> | Result<TOut, TErr>),
    error?: (error: TErr) => (NonNullable<TOut> | Result<TOut, TErr>)
): LazyPipeStep<TIn, TOut, TErr> {
    const pipe = {
        onValue: (value: TIn) => {
            const result = fn(value);
            return isResult(result) ? result : ok(result);
        }
    } as LazyPipeStep<TIn, TOut, TErr>;

    if (error) {
        pipe.onError = (err: TErr) => {
            const result = error(err);
            return isResult(result) ? result : ok(result);
        }
    }

    return pipe;
}

/**
 * Creates a new async step that maps a value to another value.
 * 
 * @example
 * ```ts
 * const pipe = forStepsAsync(
 *  mapAsync((value: number) => Promise.resolve(BigInt(value + 1))),
 *  map(value => value.toString()),
 * ).catchDefault('an error').create();
 * 
 * assertResultOkEqual(await pipe.run(1), '2');
 * ```
 * 
 * @param fn mapping function
 * @param error mapping function for errors
 * @returns a new step
 */
export function mapAsync<TIn, TOut, TErr = any>(
    fn: (value: TIn) => (Promise<NonNullable<TOut>> | ResultAsync<TOut, TErr>),
    error?: (error: TErr) => (Promise<NonNullable<TOut>> | ResultAsync<TOut, TErr>)
): LazyPipeStepAsync<TIn, TOut, TErr> {
    const pipe = {
        onValue: async (value: TIn) => {
            const result = await fn(value);
            return isResult(result) ? result : ok(result);
        }
    } as LazyPipeStepAsync<TIn, TOut, TErr>;

    if (error) {
        pipe.onError = async (err: TErr) => {
            const result = await error(err);
            return isResult(result) ? result : ok(result);
        }
    }

    return pipe;
}
