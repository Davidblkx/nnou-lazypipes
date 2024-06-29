import { assertEquals, assertThrows } from '@std/assert';

import { emptyPipe } from './operators/create.empty.ts';
import { assertResultErrEqual, assertResultOkEqual, ok } from '@nnou/result';
import { assertNone, assertSome } from '@nnou/option';

Deno.test('LazyPipe', async (t) => {
    await t.step('run in order', () => {
        const pipe = emptyPipe<string, void>()
            .next({
                onValue: (z) => ok(z + 'a'),
            }).next({
                onValue: (z) => ok(z + 'b'),
            });

        const result = pipe.run('');
        assertResultOkEqual(result, 'ab');
    });

    await t.step('respect last output', () => {
        const pipe = emptyPipe<string, void>()
            .next({
                onValue: (_) => ok(0),
            }).next({
                onValue: (_) => ok(false),
            });

        const result = pipe.run('');
        assertResultOkEqual(result, false);
    });

    await t.step('is immutable', () => {
        const pipe1 = emptyPipe<string, void>()
            .next({
                onValue: (_) => ok(0),
            });

        const _pipe2 = pipe1.next({
            onValue: (_) => ok(false),
        });

        const result1 = pipe1.run('');
        assertResultOkEqual(result1, 0);
    });

    await t.step('on error', async (t2) => {
        await t2.step('follow error path', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).next({
                    onValue: (_) => ok(false),
                    onError: (_) => ok(true),
                })
                .catch((_) => 'my error');

            const result = pipe.run('');
            assertResultOkEqual(result, true);
        });

        await t2.step('catch error', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).next({
                    onValue: (_) => ok(false),
                })
                .catch((_) => 'my error');

            const result = pipe.run('');
            assertResultErrEqual(result, 'my error');
        });

        await t2.step('throw unhandled error', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).next({
                    onValue: (_) => ok(false),
                });

            assertThrows(() => pipe.run(''));
        });

        await t2.step('use default error', () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).next({
                    onValue: (_) => ok(false),
                });

            const result = pipe.run('');
            assertResultErrEqual(result, 'my error');
        });

        await t2.step('cath override default error', () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).next({
                    onValue: (_) => ok(false),
                })
                .catch((_) => 'my error 2');

            const result = pipe.run('');
            assertResultErrEqual(result, 'my error 2');
        });
    });

    await t.step('.maybe', async (t2) => {
        await t2.step('when ok, return some', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => ok('a'),
                });

            const result = pipe.maybe('');
            assertSome(result);
            assertEquals(result.value, 'a');
        });

        await t2.step('when not ok, return none', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                });

            const result = pipe.maybe('');
            assertNone(result);
        });
    });

    await t.step('.force', async (t2) => {
        await t2.step('when ok, return value', () => {
            const pipe = emptyPipe<string, string>()
                .next({
                    onValue: (_) => ok('a'),
                });

            const result = pipe.force('');
            assertEquals(result, 'a');
        });

        await t2.step('when not ok, throw error', () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .next({
                    onValue: (_) => {
                        throw new Error();
                    },
                });

            assertThrows(() => pipe.force(''));
        });
    });
});
