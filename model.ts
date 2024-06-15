import type { Result, ResultAsync } from '@nnou/result';
import type { Option, AsyncOption } from '@nnou/option';

export type LazyPipeStep<TIn, TOut, TErr> = {
    onValue: (value: TIn) => Result<TOut, TErr>,
    onError?: (error: unknown, value: Result<TIn, TErr>) => Result<TOut, TErr>
};

export type LazyPipeStepAsync<TIn, TOut, TErr> = {
    onValue: (value: TIn) => (ResultAsync<TOut, TErr> | Result<TOut, TErr>),
    onError?: (error: unknown, value: Result<TIn, TErr>) => (ResultAsync<TOut, TErr> | Result<TOut, TErr>)
};

export interface LazyPipe<TIn, TOut, TErr = unknown> {
    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipe<TIn, T, TErr>;

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;

    catch(onError: (error: unknown) => NonNullable<TErr>): LazyPipe<TIn, TOut, TErr>;

    Run(value?: NonNullable<TIn>): Result<TOut, TErr>;

    safeRun(value?: NonNullable<TIn>): Option<TOut>;

    unsafeRun(value?: NonNullable<TIn>): TOut;
}

export interface LazyPipeAsync<TIn, TOut, TErr = unknown> {
    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;

    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;

    catch(onError: (error: unknown) => NonNullable<TErr>): LazyPipeAsync<TIn, TOut, TErr>;

    run(value?: NonNullable<TIn>): ResultAsync<TOut, TErr>;

    safeRun(value?: NonNullable<TIn>): AsyncOption<TOut>;

    unsafeRun(value?: NonNullable<TIn>): Promise<TOut>;
}
