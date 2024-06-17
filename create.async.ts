// deno-lint-ignore-file no-explicit-any
import type { LazyPipeAsync, LazyPipeStepAsync, ErrorHandler } from './model.ts';
import { LazyPipeAsyncImpl } from './lazy_pipe_async.ts';

/** Helper to builds a new pipeline for a sequence of steps. */
export interface LazyPipeBuilderAsync<TIn, TOut, TErr> {
    /** Creates a error handler that always return the same value */
    catchDefault<TErr>(error: NonNullable<TErr>): LazyPipeBuilderAsync<TIn, TOut, TErr>;
    /** Creates a custom error handler */
    catch<TErr>(error: ErrorHandler<TErr>): LazyPipeBuilderAsync<TIn, TOut, TErr>;
    /** Creates the lazy pipeline */
    create(): LazyPipeAsync<TIn, TOut, TErr>;
}

/**
 * Builds a new pipeline for a sequence of steps.
 * 
 * @example
 * ```ts
 * const pipe = forStepsAsync(
 *    mapAsync((value: number) => Promise.resolve(BigInt(value + 1))),
 *    map(value => value.toString()),
 * ).catchDefault('an error').create();
 * 
 * assertResultOkEqual(await pipe.run(1), '2');
 * ```
 * 
 * @param step1 first step of the pipeline
 */
export function forStepsAsync<TIn, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, T5, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, T5, TErr>,
    step6: LazyPipeStepAsync<T5, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, T5, T6, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, T5, TErr>,
    step6: LazyPipeStepAsync<T5, T6, TErr>,
    step7: LazyPipeStepAsync<T6, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, T5, T6, T7, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, T5, TErr>,
    step6: LazyPipeStepAsync<T5, T6, TErr>,
    step7: LazyPipeStepAsync<T6, T7, TErr>,
    step8: LazyPipeStepAsync<T7, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, T5, T6, T7, T8, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, T5, TErr>,
    step6: LazyPipeStepAsync<T5, T6, TErr>,
    step7: LazyPipeStepAsync<T6, T7, TErr>,
    step8: LazyPipeStepAsync<T7, T8, TErr>,
    step9: LazyPipeStepAsync<T8, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forStepsAsync<TIn, T1, T2, T3, T4, T5, T6, T7, T8, T9, TOut, TErr>(
    step1: LazyPipeStepAsync<TIn, T1, TErr>,
    step2: LazyPipeStepAsync<T1, T2, TErr>,
    step3: LazyPipeStepAsync<T2, T3, TErr>,
    step4: LazyPipeStepAsync<T3, T4, TErr>,
    step5: LazyPipeStepAsync<T4, T5, TErr>,
    step6: LazyPipeStepAsync<T5, T6, TErr>,
    step7: LazyPipeStepAsync<T6, T7, TErr>,
    step8: LazyPipeStepAsync<T7, T8, TErr>,
    step9: LazyPipeStepAsync<T8, T9, TErr>,
    step10: LazyPipeStepAsync<T9, TOut, TErr>
): LazyPipeBuilderAsync<TIn, TOut, TErr>;
export function forStepsAsync(...steps: LazyPipeStepAsync<any, any, any>[]): LazyPipeBuilderAsync<any, any, any> {
    return new LazyPipeAsyncBuilderImpl(steps);
}

class LazyPipeAsyncBuilderImpl implements LazyPipeBuilderAsync<any, any, any> {
    #steps: LazyPipeStepAsync<any, any, any>[];
    #catcher?: ErrorHandler<any>;

    constructor(steps: LazyPipeStepAsync<any, any, any>[]) {
        this.#steps = steps;
    }

    catchDefault<TErr>(error: NonNullable<TErr>): LazyPipeBuilderAsync<any, any, TErr> {
        this.#catcher = () => error;
        return this as unknown as LazyPipeBuilderAsync<any, any, TErr>;
    }

    catch<TErr>(error: ErrorHandler<TErr>): LazyPipeBuilderAsync<any, any, TErr> {
        this.#catcher = error;
        return this as unknown as LazyPipeBuilderAsync<any, any, TErr>;
    }

    create(): LazyPipeAsync<any, any, any> {
        return new LazyPipeAsyncImpl([...this.#steps], this.#catcher);
    }
}
