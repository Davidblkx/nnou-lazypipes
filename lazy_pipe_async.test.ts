import { assertEquals, assertRejects } from '@std/assert';

import { emptyPipe } from './operators/create.empty.ts';
import { assertResultErrEqual, assertResultOkEqual, ok } from '@nnou/result';
import { assertNone, assertSome } from '@nnou/option';

Deno.test('LazyPipeAsync', async (t) => {
    await t.step('run in order', async () => {
        const pipe = emptyPipe<string, void>()
            .nextAsync({
                onValue: (z) => Promise.resolve(ok(z + 'a')),
            }).nextAsync({
                onValue: (z) => Promise.resolve(ok(z + 'b')),
            });

        const result = await pipe.run('');
        assertResultOkEqual(result, 'ab');
    });

    await t.step('run in order with sync', async () => {
        const pipe = emptyPipe<string, void>()
            .nextAsync({
                onValue: (z) => Promise.resolve(ok(z + 'a')),
            }).next({
                onValue: (z) => ok(z + 'b'),
            }).nextAsync({
                onValue: (z) => Promise.resolve(ok(z + 'c')),
            });

        const result = await pipe.run('');
        assertResultOkEqual(result, 'abc');
    });

    await t.step('respect last output', async () => {
        const pipe = emptyPipe<string, void>()
            .nextAsync({
                onValue: (_) => Promise.resolve(ok(0)),
            }).nextAsync({
                onValue: (_) => Promise.resolve(ok(false)),
            });

        const result = await pipe.run('');
        assertResultOkEqual(result, false);
    });

    await t.step('is immutable', async () => {
        const pipe1 = emptyPipe<string, void>()
            .nextAsync({
                onValue: (_) => Promise.resolve(ok(0)),
            });

        const _pipe2 = pipe1.nextAsync({
            onValue: (_) => Promise.resolve(ok(false)),
        });

        const result1 = await pipe1.run('');
        assertResultOkEqual(result1, 0);
    });

    await t.step('on error', async (t2) => {
        await t2.step('follow error path', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).nextAsync({
                    onValue: (_) => Promise.resolve(ok(false)),
                    onError: (_) => Promise.resolve(ok(true)),
                })
                .catch((_) => 'my error');

            const result = await pipe.run('');
            assertResultOkEqual(result, true);
        });

        await t2.step('catch error', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).nextAsync({
                    onValue: (_) => Promise.resolve(ok(false)),
                })
                .catch((_) => 'my error');

            const result = await pipe.run('');
            assertResultErrEqual(result, 'my error');
        });

        await t2.step('throw unhandled error', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).nextAsync({
                    onValue: (_) => Promise.resolve(ok(false)),
                });

            await assertRejects(() => pipe.run(''));
        });

        await t2.step('use default error', async () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).nextAsync({
                    onValue: (_) => Promise.resolve(ok(false)),
                });

            const result = await pipe.run('');
            assertResultErrEqual(result, 'my error');
        });

        await t2.step('cath override default error', async () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                }).nextAsync({
                    onValue: (_) => Promise.resolve(ok(false)),
                })
                .catch((_) => 'my error 2');

            const result = await pipe.run('');
            assertResultErrEqual(result, 'my error 2');
        });
    });

    await t.step('.maybe', async (t2) => {
        await t2.step('when ok, return some', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => Promise.resolve(ok('a')),
                });

            const result = await pipe.maybe('');
            assertSome(result);
            assertEquals(result.value, 'a');
        });

        await t2.step('when not ok, return none', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                });

            const result = await pipe.maybe('');
            assertNone(result);
        });
    });

    await t.step('.force', async (t2) => {
        await t2.step('when ok, return value', async () => {
            const pipe = emptyPipe<string, string>()
                .nextAsync({
                    onValue: (_) => Promise.resolve(ok('a')),
                });

            const result = await pipe.force('');
            assertEquals(result, 'a');
        });

        await t2.step('when not ok, throw error', async () => {
            const pipe = emptyPipe<string, string>((_) => 'my error')
                .nextAsync({
                    onValue: (_) => {
                        throw new Error();
                    },
                });

            await assertRejects(() => pipe.force(''));
        });
    });
});
