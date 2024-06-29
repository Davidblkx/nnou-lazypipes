// deno-lint-ignore-file no-explicit-any
import type { ErrorHandler, LazyPipe, LazyPipeStep } from '../model.ts';
import { LazyPipeImpl } from '../lazy_pipe.ts';

/** Helper to builds a new pipeline for a sequence of steps. */
export interface LazyPipeBuilder<TIn, TOut, TErr> {
    /** Creates a error handler that always return the same value */
    catchDefault<TErr>(error: NonNullable<TErr>): LazyPipeBuilder<TIn, TOut, TErr>;
    /** Creates a custom error handler */
    catch<TErr>(error: ErrorHandler<TErr>): LazyPipeBuilder<TIn, TOut, TErr>;
    /** Creates the lazy pipeline */
    create(): LazyPipe<TIn, TOut, TErr>;
}

/**
 * Builds a new pipeline for a sequence of steps.
 *
 * @example
 * ```ts
 * const pipe = forSteps(
 *   map((value: number) => BigInt(value + 1)),
 *   map(value => value.toString()),
 * ).catchDefault('an error').create();
 *
 * assertResultOkEqual(pipe.run(1), '2');
 * ```
 *
 * @param step1 first step of the pipeline
 */
export function forSteps<TIn, TOut, TErr>(
    step1: LazyPipeStep<TIn, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, T5, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, T5, TErr>,
    step6: LazyPipeStep<T5, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, T5, T6, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, T5, TErr>,
    step6: LazyPipeStep<T5, T6, TErr>,
    step7: LazyPipeStep<T6, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, T5, T6, T7, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, T5, TErr>,
    step6: LazyPipeStep<T5, T6, TErr>,
    step7: LazyPipeStep<T6, T7, TErr>,
    step8: LazyPipeStep<T7, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, T5, T6, T7, T8, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, T5, TErr>,
    step6: LazyPipeStep<T5, T6, TErr>,
    step7: LazyPipeStep<T6, T7, TErr>,
    step8: LazyPipeStep<T7, T8, TErr>,
    step9: LazyPipeStep<T8, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
/** Builds a new pipeline for a sequence of steps. */
export function forSteps<TIn, T1, T2, T3, T4, T5, T6, T7, T8, T9, TOut, TErr>(
    step1: LazyPipeStep<TIn, T1, TErr>,
    step2: LazyPipeStep<T1, T2, TErr>,
    step3: LazyPipeStep<T2, T3, TErr>,
    step4: LazyPipeStep<T3, T4, TErr>,
    step5: LazyPipeStep<T4, T5, TErr>,
    step6: LazyPipeStep<T5, T6, TErr>,
    step7: LazyPipeStep<T6, T7, TErr>,
    step8: LazyPipeStep<T7, T8, TErr>,
    step9: LazyPipeStep<T8, T9, TErr>,
    step10: LazyPipeStep<T9, TOut, TErr>,
): LazyPipeBuilder<TIn, TOut, TErr>;
export function forSteps(...steps: LazyPipeStep<any, any, any>[]): LazyPipeBuilder<any, any, any> {
    return new LazyPipeBuilderImpl(steps);
}

class LazyPipeBuilderImpl implements LazyPipeBuilder<any, any, any> {
    #steps: LazyPipeStep<any, any, any>[];
    #catcher?: ErrorHandler<any>;

    constructor(steps: LazyPipeStep<any, any, any>[]) {
        this.#steps = steps;
    }

    catchDefault<TErr>(error: NonNullable<TErr>): LazyPipeBuilder<any, any, TErr> {
        this.#catcher = () => error;
        return this as unknown as LazyPipeBuilder<any, any, TErr>;
    }

    catch<TErr>(error: ErrorHandler<TErr>): LazyPipeBuilder<any, any, TErr> {
        this.#catcher = error;
        return this as unknown as LazyPipeBuilder<any, any, TErr>;
    }

    create(): LazyPipe<any, any, any> {
        return new LazyPipeImpl([...this.#steps], this.#catcher);
    }
}
