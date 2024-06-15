// deno-lint-ignore-file no-explicit-any
import { type Result, ok, err } from '@nnou/result';
import { type Option, fromResult } from '@nnou/option';

import type { LazyPipe, LazyPipeAsync, LazyPipeStep, LazyPipeStepAsync } from './model.ts';
import { UnhandledError } from './errors.ts';
import { LazyPipeAsyncImpl } from './lazy_pipe_async.ts';

export class LazyPipeImpl<TIn, TOut, TErr = unknown> implements LazyPipe<TIn, TOut, TErr> {
    
    #steps: LazyPipeStep<any, any, any>[];
    #catch?: (error: unknown) => NonNullable<TErr>;

    constructor(
        steps: LazyPipeStep<any, any, any>[] = [],
        onCatch?: (error: unknown) => NonNullable<TErr>
    ) {
        this.#steps = steps;
        this.#catch = onCatch;
    }

    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipe<TIn, T, TErr> {
        this.#steps.push(step);
        return this as unknown as LazyPipe<TIn, T, TErr>;
    }

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        return new LazyPipeAsyncImpl([
            ...this.#steps,
            step
        ], this.#catch);
    }

    catch(onError: (error: unknown) => NonNullable<TErr>): LazyPipe<TIn, TOut, TErr> {
        this.#catch = onError;
        return this;
    }

    Run(value: NonNullable<TIn>): Result<TOut, TErr> {
        let result: Result<any, any> = ok(value);

        for (const step of this.#steps) {
            try {
                if (result.ok) {
                    result = step.onValue(result.value);
                } else if (step.onError) {
                    result = step.onError(result.error, result);
                }
            } catch (e) {
                if (step.onError) {
                    result = step.onError(e, result);
                } else if (this.#catch) {
                    result = err(this.#catch(e));
                } else {
                    throw new UnhandledError(e);
                }
            }
        }

        return result;
    }

    safeRun(value: NonNullable<TIn>): Option<TOut> {
        return fromResult(this.Run(value));
    }

    unsafeRun(value: NonNullable<TIn>): TOut {
        const res = this.Run(value);
        if (res.ok) {
            return res.value;
        }

        throw new UnhandledError(res.error);
    }
}