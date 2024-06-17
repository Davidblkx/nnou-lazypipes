// deno-lint-ignore-file no-explicit-any
import { type Result, ok, err } from '@nnou/result';
import { type Option, fromResult, none } from '@nnou/option';

import type { LazyPipe, LazyPipeAsync, LazyPipeStep, LazyPipeStepAsync, ErrorHandler } from './model.ts';
import { UnhandledError } from './errors.ts';
import { LazyPipeAsyncImpl } from './lazy_pipe_async.ts';

export class LazyPipeImpl<TIn, TOut, TErr = unknown> implements LazyPipe<TIn, TOut, TErr> {
    
    #steps: LazyPipeStep<any, any, any>[];
    #catch?: ErrorHandler<TErr>;

    constructor(
        steps: LazyPipeStep<any, any, any>[] = [],
        onCatch?: ErrorHandler<TErr>
    ) {
        this.#steps = steps;
        this.#catch = onCatch;
    }

    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipe<TIn, T, TErr> {
        return new LazyPipeImpl([
            ...this.#steps,
            step
        ], this.#catch);
    }

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        return new LazyPipeAsyncImpl([
            ...this.#steps,
            step
        ], this.#catch);
    }

    catch(onError: ErrorHandler<TErr>): LazyPipe<TIn, TOut, TErr> {
        return new LazyPipeImpl([...this.#steps], onError);
    }

    run(value: NonNullable<TIn>): Result<TOut, TErr> {
        let result: Result<any, any> = ok(value);

        for (const step of this.#steps) {
            try {
                if (result.ok) {
                    result = step.onValue(result.value);
                } else if (step.onError) {
                    result = step.onError(result.error);
                }
            } catch (e) {
                if (this.#catch) {
                    result = err(this.#catch(e));
                } else {
                    throw new UnhandledError(e);
                }
            }
        }

        return result;
    }

    maybe(value: NonNullable<TIn>): Option<TOut> {
        try {
            return fromResult(this.run(value));
        } catch {
            return none();
        }
    }

    force(value: NonNullable<TIn>): TOut {
        const res = this.run(value);
        if (res.ok) {
            return res.value;
        }

        throw new UnhandledError(res.error);
    }
}