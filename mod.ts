/**
 * @module lazyPipe
 *
 * @description Create lazy pipes with Rust-like Option/Result types. It allows you to chain operations and handle errors in a functional way.
 *
 * @example
 * ```ts
 * import { forStepsAsync, mapAsync, map } from '@nnou/lazy-pipes';
 * import { err, ok } from '@nnou/result';
 *
 * interface Info { data: string }
 * type MyError = `Error while fetching: ${string}` | 'Invalid JSON' | 'Unknown error';
 *
 * function isInfo(value: unknown): value is Info {
 *     return typeof value === 'object'
 *         && value !== null
 *         && 'data' in value
 *         && typeof value['data'] === 'string';
 * }
 *
 * const fetchInfo = forStepsAsync(
 *     mapAsync((url: string) => fetch(url)),
 *     mapAsync(response => response.json()),
 *     map(v => isInfo(v) ? ok(v) : err('Invalid JSON'))
 * ).catch<MyError>(error => {
 *     if (error instanceof Error) {
 *         return `Error while fetching: ${error.message}`;
 *     }
 *
 *     return 'Unknown error';
 * }).create();
 *
 * const result = await fetchInfo.run('https://api.example.com/info');
 * if (result.ok) {
 *     console.log(result.value);
 * } else {
 *     console.error(result.error);
 * }
 * ```
 */

export * from './operators/create.empty.ts';
export * from './operators/create.step.ts';
export * from './operators/create.async.ts';
export * from './errors.ts';
export * from './operators/map.ts';
export * from './model.ts';
