
/**
 * Error class for unhandled errors.
 */
export class UnhandledError extends Error {
    /** Actual unhandled error */
    innerErr: unknown;

    /**
     * Creates a new instance of UnhandledError.
     * 
     * @param innerErr Actual unhandled error
     */
    constructor(innerErr: unknown) {
        super('Unhandled error');
        this.innerErr = innerErr;
    }
}
