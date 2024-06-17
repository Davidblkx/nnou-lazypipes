import type { Result, ResultAsync } from '@nnou/result';
import type { Option, OptionAsync } from '@nnou/option';

/** Function to handle exceptions */
export type ErrorHandler<TErr> = (error: unknown) => NonNullable<TErr>;

/** Synchronous step */
export type LazyPipeStep<TIn, TOut, TErr> = {
    /** Logic to run when has ok value */
    onValue: (value: TIn) => Result<TOut, TErr>,
    /** Logic to run when has error value */
    onError?: (error: TErr) => Result<TOut, TErr>
};

/** Asynchronous step */
export type LazyPipeStepAsync<TIn, TOut, TErr> = {
    /** Logic to run when has ok value */
    onValue: (value: TIn) => (ResultAsync<TOut, TErr> | Result<TOut, TErr>),
    /** Logic to run when has error value */
    onError?: (error: TErr) => (ResultAsync<TOut, TErr> | Result<TOut, TErr>)
};

/** Synchronous pipeline */
export interface LazyPipe<TIn, TOut, TErr = unknown> {
    /** Creates a new pipeline with an extra step */
    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipe<TIn, T, TErr>;
    /** Creates a new async pipeline with an extra step */
    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;
    /** Return a pipeline with an error handler */
    catch(onError: ErrorHandler<TErr>): LazyPipe<TIn, TOut, TErr>;
    /** Run pipeline */
    run(value?: NonNullable<TIn>): Result<TOut, TErr>;
    /** Run pipeline and return a option */
    maybe(value?: NonNullable<TIn>): Option<TOut>;
    /** Run pipeline and return a value, throw if failed */
    force(value?: NonNullable<TIn>): TOut;
}

/** Asynchronous pipeline */
export interface LazyPipeAsync<TIn, TOut, TErr = unknown> {
    /** Creates a new pipeline with an extra step */
    next<T>(step: LazyPipeStep<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;
    /** Creates a new async pipeline with an extra step */
    nextAsync<T>(step: LazyPipeStepAsync<TOut, T, TErr>): LazyPipeAsync<TIn, T, TErr>;
    /** Return a pipeline with an error handler */
    catch(onError: ErrorHandler<TErr>): LazyPipeAsync<TIn, TOut, TErr>;
    /** Run pipeline */
    run(value?: NonNullable<TIn>): ResultAsync<TOut, TErr>;
    /** Run pipeline and return a option */
    maybe(value?: NonNullable<TIn>): OptionAsync<TOut>;
    /** Run pipeline and return a value, throw if failed */
    force(value?: NonNullable<TIn>): Promise<TOut>;
}
