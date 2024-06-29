import { forSteps } from './create.step.ts';
import { forStepsAsync } from './create.async.ts';
import { map, mapAsync } from './map.ts';

import { assertResultErrEqual, assertResultOkEqual } from '@nnou/result';

Deno.test('.forSteps', async (t) => {
    await t.step('create pipeline for steps', () => {
        const pipe = forSteps(
            map((value: number) => BigInt(value + 1)),
            map((value) => value.toString()),
        ).catchDefault('an error').create();

        assertResultOkEqual(pipe.run(1), '2');
    });

    await t.step('create pipeline for steps with default error', () => {
        const pipe = forSteps(
            map((value: number) => BigInt(value + 1)),
            map((_) => {
                throw new Error('is invalid');
            }),
        ).catchDefault('an error').create();

        assertResultErrEqual(pipe.run(1), 'an error');
    });

    await t.step('create pipeline for steps with error handler', () => {
        const pipe = forSteps(
            map((value: number) => BigInt(value + 1)),
            map((_) => {
                throw new Error('is invalid');
            }),
        ).catch((err) => {
            if (err instanceof Error) {
                return 'an error: ' + err.message;
            }

            return 'an error';
        }).create();

        assertResultErrEqual(pipe.run(1), 'an error: is invalid');
    });
});

Deno.test('.forStepsAsync', async (t) => {
    await t.step('create pipeline for steps', async () => {
        const pipe = forStepsAsync(
            mapAsync((value: number) => Promise.resolve(BigInt(value + 1))),
            map((value) => value.toString()),
        ).catchDefault('an error').create();

        assertResultOkEqual(await pipe.run(1), '2');
    });

    await t.step('create pipeline for steps with default error', async () => {
        const pipe = forStepsAsync(
            mapAsync((value: number) => Promise.resolve(BigInt(value + 1))),
            mapAsync((_) => {
                throw new Error('is invalid');
            }),
        ).catchDefault('an error').create();

        assertResultErrEqual(await pipe.run(1), 'an error');
    });

    await t.step('create pipeline for steps with error handler', async () => {
        const pipe = forStepsAsync(
            mapAsync((value: number) => Promise.resolve(BigInt(value + 1))),
            mapAsync((_) => {
                throw new Error('is invalid');
            }),
        ).catch((err) => {
            if (err instanceof Error) {
                return 'an error: ' + err.message;
            }

            return 'an error';
        }).create();

        assertResultErrEqual(await pipe.run(1), 'an error: is invalid');
    });
});
