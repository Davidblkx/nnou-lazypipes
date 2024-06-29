// deno-lint-ignore-file no-explicit-any
import { err, ok, type Result, type ResultAsync } from '@nnou/result';
import { fromResult, none, type OptionAsync } from '@nnou/option';

import type { ErrorHandler, LazyPipeAsync, LazyPipeStep, LazyPipeStepAsync, LazyPipeStepsAsync } from './model.ts';
import { UnhandledError } from './errors.ts';

/** Implementation of an asynchronous pipeline */
export class LazyPipeAsyncImpl<TIn, TOut, TErr = unknown> implements LazyPipeAsync<TIn, TOut, TErr> {
    #steps: LazyPipeStepAsync<any, any, any>[];
    #catch?: ErrorHandler<TErr>;

    get steps(): LazyPipeStepsAsync<TIn, TOut, TErr> {
        return this.#steps as LazyPipeStepsAsync<TIn, TOut, TErr>;
    }

    constructor(
        steps: LazyPipeStepAsync<any, any, any>[] = [],
        onCatch?: ErrorHandler<TErr>,
    ) {
        this.#steps = steps;
        this.#catch = onCatch;
    }

    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        return new LazyPipeAsyncImpl([...this.#steps, step], this.#catch);
    }

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        return new LazyPipeAsyncImpl([...this.#steps, step], this.#catch);
    }

    catch(onError: ErrorHandler<TErr>): LazyPipeAsync<TIn, TOut, TErr> {
        return new LazyPipeAsyncImpl([...this.#steps], onError);
    }

    async run(value?: NonNullable<TIn>): ResultAsync<TOut, TErr> {
        let result: Result<any, any> = ok(value as unknown as NonNullable<TIn>);

        for (const step of this.#steps) {
            try {
                if (result.ok) {
                    result = await step.onValue(result.value);
                } else if (step.onError) {
                    result = await step.onError(result.error);
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
    async maybe(value?: NonNullable<TIn>): OptionAsync<TOut> {
        try {
            const res = await this.run(value);
            return fromResult(res);
        } catch {
            return none();
        }
    }

    async force(value?: NonNullable<TIn>): Promise<TOut> {
        const res = await this.run(value);
        if (res.ok) {
            return res.value;
        } else {
            throw new UnhandledError(res.error);
        }
    }
}
