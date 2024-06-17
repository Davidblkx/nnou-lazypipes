
/**
 * Error class for unhandled errors.
 */
export class UnhandledError extends Error {
    innerErr: unknown;

    constructor(innerErr: unknown) {
        super('Unhandled error');
        this.innerErr = innerErr;
    }
}
