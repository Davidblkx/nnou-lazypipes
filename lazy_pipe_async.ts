// deno-lint-ignore-file no-explicit-any
import { type Result, type ResultAsync, ok, err } from '@nnou/result';
import { fromResult, type AsyncOption } from '@nnou/option';

import type { LazyPipeAsync, LazyPipeStep, LazyPipeStepAsync } from './model.ts';
import { UnhandledError } from './errors.ts';

export class LazyPipeAsyncImpl<TIn, TOut, TErr = unknown> implements LazyPipeAsync<TIn, TOut, TErr> {
    #steps: LazyPipeStepAsync<any, any, any>[];
    #catch?: (error: unknown) => NonNullable<TErr>;

    constructor(
        steps: LazyPipeStepAsync<any, any, any>[] = [],
        onCatch?: (error: unknown) => NonNullable<TErr>
    ) {
        this.#steps = steps;
        this.#catch = onCatch;
    }

    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        this.#steps.push(step);
        return this as unknown as LazyPipeAsync<TIn, T, TErr>;
    }

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr> {
        this.#steps.push(step);
        return this as unknown as LazyPipeAsync<TIn, T, TErr>;
    }

    catch(onError: (error: unknown) => NonNullable<TErr>): LazyPipeAsync<TIn, TOut, TErr> {
        this.#catch = onError;
        return this;
    }
    async run(value?: NonNullable<TIn>): ResultAsync<TOut, TErr> {
        let result: Result<any, any> = ok(value as unknown as NonNullable<TIn>);

        for (const step of this.#steps) {
            try {
                if (result.ok) {
                    result = await step.onValue(result.value);
                } else if (step.onError) {
                    result = await step.onError(result.error, result);
                }
            } catch (e) {
                if (step.onError) {
                    result = await step.onError(e, result);
                } else if (this.#catch) {
                    result = err(this.#catch(e));
                } else {
                    throw new UnhandledError(e);
                }
            }
        }

        return result;
    }
    async safeRun(value?: NonNullable<TIn>): AsyncOption<TOut> {
        const res = await this.run(value);
        return fromResult(res);
    }

    async unsafeRun(value?: NonNullable<TIn>): Promise<TOut> {
        const res = await this.run(value);
        if (res.ok) {
            return res.value;
        } else {
            throw new UnhandledError(res.error);
        }
    }
}