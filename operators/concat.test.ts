import { concat } from './concat.ts';
import { emptyPipe } from './create.empty.ts';
import { map, mapAsync } from './map.ts';

import { assertResultErrEqual, assertResultOkEqual } from '@nnou/result';

Deno.test('concat', async (t) => {
    await t.step('sync pipes', async (tSync) => {
        await tSync.step('concat pipelines', () => {
            const pipe = emptyPipe<number, number>()
                .next(map((v) => v + 1));

            const subject = concat(pipe, pipe)
                .next(map(([v1, v2]) => v1 + v2));

            const result = subject.run([1, 2]);

            assertResultOkEqual(result, 5);
        });

        await tSync.step('on error in first pipe, returns error', () => {
            const pipe1 = emptyPipe<number, number>()
                .next(map(() => {
                    throw new Error('error');
                }))
                .catch(() => 10);

            const pipe2 = emptyPipe<number, number>()
                .next(map((v) => v + 1));

            const subject = concat(pipe1, pipe2)
                .next(map(([v1, v2]) => v1 + v2));

            const result = subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });

        await tSync.step('on error in second pipe, returns error', () => {
            const pipe1 = emptyPipe<number, number>()
                .next(map((v) => v + 1));

            const pipe2 = emptyPipe<number, number>()
                .next(map(() => {
                    throw new Error('error');
                }))
                .catch(() => 10);

            const subject = concat(pipe1, pipe2)
                .next(map(([v1, v2]) => v1 + v2));

            const result = subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });

        await tSync.step('uses error handler', () => {
            const pipe1 = emptyPipe<number, number>()
                .next(map((v) => v + 1));

            const pipe2 = emptyPipe<number, number>()
                .next(map(() => {
                    throw new Error('error');
                }));

            const subject = concat(pipe1, pipe2, () => 10)
                .next(map(([v1, v2]) => v1 + v2));

            const result = subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });
    });

    await t.step('async pipes', async (tAsync) => {
        await tAsync.step('concat pipelines', async () => {
            const pipe = emptyPipe<number, number>()
                .nextAsync(mapAsync((v) => Promise.resolve(v + 1)));

            const subject = concat(pipe, pipe)
                .next(map(([v1, v2]) => v1 + v2));

            const result = await subject.run([1, 2]);

            assertResultOkEqual(result, 5);
        });

        await tAsync.step('on error in first pipe, returns error', async () => {
            const pipe1 = emptyPipe<number, number>()
                .nextAsync<number>(mapAsync(() => {
                    throw new Error('error');
                }))
                .catch(() => 10);

            const pipe2 = emptyPipe<number, number>()
                .nextAsync(mapAsync((v) => Promise.resolve(v + 1)));

            const subject = concat(pipe1, pipe2)
                .next(map(([v1, v2]) => v1 + v2));

            const result = await subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });

        await tAsync.step('on error in second pipe, returns error', async () => {
            const pipe1 = emptyPipe<number, number>()
                .nextAsync(mapAsync((v) => Promise.resolve(v + 1)));

            const pipe2 = emptyPipe<number, number>()
                .nextAsync<number>(mapAsync(() => {
                    throw new Error('error');
                }))
                .catch(() => 10);

            const subject = concat(pipe1, pipe2)
                .next(map(([v1, v2]) => v1 + v2));

            const result = await subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });

        await tAsync.step('uses error handler', async () => {
            const pipe1 = emptyPipe<number, number>()
                .nextAsync(mapAsync((v) => Promise.resolve(v + 1)));

            const pipe2 = emptyPipe<number, number>()
                .nextAsync<number>(mapAsync(() => {
                    throw new Error('error');
                }));

            const subject = concat(pipe1, pipe2, () => 10)
                .next(map(([v1, v2]) => v1 + v2));

            const result = await subject.run([1, 2]);

            assertResultErrEqual(result, 10);
        });
    });
});
