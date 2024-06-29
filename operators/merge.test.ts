import { merge } from './merge.ts';
import { emptyPipe } from './create.empty.ts';
import { map, mapAsync } from './map.ts';

import { assertResultErrEqual, assertResultOkEqual } from '@nnou/result';

Deno.test('merge', async (t) => {
    await t.step('sync pipes', async (tSync) => {
        await tSync.step('merge value', () => {
            const pipe = merge(
                emptyPipe<string>().next(map((v) => v.length)),
                emptyPipe<number>().next(map((v) => v.toString())),
            );

            const result = pipe.run('test');
            assertResultOkEqual(result, '4');
        });

        await tSync.step('when entry pipe has catch, uses it to catch', () => {
            const pipe = merge(
                emptyPipe<string, number>(() => 10).next(map((v) => v.length)),
                emptyPipe<number, number>().next(map(() => {
                    throw new Error('test');
                })),
            );

            const result = pipe.run('test');
            assertResultErrEqual(result, 10);
        });

        await tSync.step('when exit pipe has catch, uses it to catch', () => {
            const pipe = merge(
                emptyPipe<string, number>().next(map((v) => v.length)),
                emptyPipe<number, number>(() => 10).next(map(() => {
                    throw new Error('test');
                })),
            );

            const result = pipe.run('test');
            assertResultErrEqual(result, 10);
        });
    });

    await t.step('async pipes', async (tAsync) => {
        await tAsync.step('merge value', async () => {
            const pipe = merge(
                emptyPipe<string>().nextAsync(mapAsync((v) => Promise.resolve(v.length))),
                emptyPipe<number>().nextAsync(mapAsync((v) => Promise.resolve(v.toString()))),
            );

            const result = await pipe.run('test');
            assertResultOkEqual(result, '4');
        });

        await tAsync.step('when entry pipe has catch, uses it to catch', async () => {
            const pipe = merge(
                emptyPipe<string, number>(() => 10).nextAsync(mapAsync((v) => Promise.resolve(v.length))),
                emptyPipe<number, number>().nextAsync(mapAsync(() => {
                    throw new Error('test');
                })),
            );

            const result = await pipe.run('test');
            assertResultErrEqual(result, 10);
        });

        await tAsync.step('when exit pipe has catch, uses it to catch', async () => {
            const pipe = merge(
                emptyPipe<string, number>().nextAsync(mapAsync((v) => Promise.resolve(v.length))),
                emptyPipe<number, number>(() => 10).nextAsync(mapAsync(() => {
                    throw new Error('test');
                })),
            );

            const result = await pipe.run('test');
            assertResultErrEqual(result, 10);
        });
    });
});
