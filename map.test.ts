import { emptyPipe } from './create.empty.ts';
import { map, mapAsync } from './map.ts';

import { assertResultOkEqual, err, ok } from '@nnou/result';

Deno.test('map', async (t) => {
    await t.step('map value', () => {
        const pipe = emptyPipe<string, number>()
            .next(map(v => v.length));

        const result = pipe.run('test');
        assertResultOkEqual(result, 4);
    });

    await t.step('map result', () => {
        const pipe = emptyPipe<string, number>()
            .next(map(v => ok(v.length)));

        const result = pipe.run('test');
        assertResultOkEqual(result, 4);
    });

    await t.step('map error', () => {
        const pipe = emptyPipe<string, number>()
            .next<string>({ onValue: _ => err(55) })
            .next(map(v => v.length, _ => 10));

        const result = pipe.run('test');
        assertResultOkEqual(result, 10);
    });

    await t.step('map error result', () => {
        const pipe = emptyPipe<string, number>()
            .next<string>({ onValue: _ => err(55) })
            .next(map(v => ok(v.length), _ => ok(10)));

        const result = pipe.run('test');
        assertResultOkEqual(result, 10);
    });
});

Deno.test('mapAsync', async (t) => {
    await t.step('map value', async () => {
        const pipe = emptyPipe<string, number>()
            .nextAsync(mapAsync(v => Promise.resolve(v.length)));

        const result = await pipe.run('test');
        assertResultOkEqual(result, 4);
    });

    await t.step('map result', async () => {
        const pipe = emptyPipe<string, number>()
            .nextAsync(mapAsync(v => Promise.resolve(ok(v.length))));

        const result = await pipe.run('test');
        assertResultOkEqual(result, 4);
    });

    await t.step('map error', async () => {
        const pipe = emptyPipe<string, number>()
            .nextAsync<string>({ onValue: _ => Promise.resolve(err(55)) })
            .nextAsync(
                mapAsync(
                    v => Promise.resolve(v.length),
                    _ => Promise.resolve(10)
                )
            );

        const result = await pipe.run('test');
        assertResultOkEqual(result, 10);
    });

    await t.step('map error result', async () => {
        const pipe = emptyPipe<string, number>()
            .nextAsync<string>({ onValue: _ => Promise.resolve(err(55)) })
            .nextAsync(
                mapAsync(
                    v => Promise.resolve(ok(v.length)),
                    _ => Promise.resolve(ok(10))
                )
            );

        const result = await pipe.run('test');
        assertResultOkEqual(result, 10);
    });
});