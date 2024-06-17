# Not null or undefined - lazy pipes

Create lazy pipes with Rust-like Option/Result types. It allows you to chain operations and handle errors in a functional way.

## Example

```ts
const fetchInfo = forStepsAsync(
    mapAsync((url: string) => fetch(url)),
    mapAsync(response => response.json()),
    map(v => isInfo(v) ? ok(v) : err('Invalid JSON'))
).catch<MyError>(error => {
    if (error instanceof Error) {
        return `Error while fetching: ${error.message}`;
    }

    return 'Unknown error';
}).create();

const result = await fetchInfo.run('https://api.example.com/info');
if (result.ok) {
    console.log(result.value);
} else {
    console.error(result.error);
}
```

# LazyPipe/LazyPipeAsync

A `LazyPipe` is a chain of operations that can be executed lazily. It is a functional way to handle errors and chain operations. It also has a async version `LazyPipeAsync`.

## Adding a step

Each step contains a function that receives a value and returns a new value. And can also have a function that receives an error and returns a another value. This allows you to handle errors in a functional way. A new step is added to the pipe with the `next` method. `next` is immutable and returns a new `LazyPipe` with the new step. `nextAsync` is the async version of `next`.

```ts
function divide(a: number, b: number): Result<number, string> {
    return b === 0 ? err('cannot divide by zero') : ok(a / b);
}

const myCalc = emptyPipe<number, string>()
    .next({ onValue: v => ok(divide(10, v)) })
    .next({
        onValue: v => ok(v * 2),
        onError: error => {
            console.error(error);
            return ok(0);
        }
    });
```

## Handling errors

At every step execution, the pipe catchs any exception and allow you to handle it. You can use the `catch` method to handle errors. `catch` is immutable and returns a new `LazyPipe` with the error handler.

```ts
const myCalc = emptyPipe<number, string>()
    .next({ onValue: v => ok(10 / v)})
    .next({
        onValue: v => ok(v * 2),
        onError: error => {
            console.error(error);
            return ok(0);
        }
    })
    .catch(error => {
        console.error(error);
        return 'cannot divide by zero'
    });
```

## Running the pipe

There are three ways to run the pipe: `run`, `maybe` and `force`. `run` executes the pipe and returns the Result<T, Error>. `maybe` executes the pipe and returns an Option<T>. `force` executes the pipe and throws an exception if it is not ok.

```ts
const result = myCalc.run(2); // Result<number, string>(10)
const maybe = myCalc.maybe(2); // Option<number>(10)
const value = myCalc.force(2); // 10
```

# Helpers

## emptyPipe<T, E>

Creates a new empty pipe.

```ts
const myPipe = emptyPipe<number, string>();
```

## map/mapAsync

Creates a new step that applies a function to the value. Can receive a second function to handle errors. It acepts a function that returns either a value or a Result<T, E>.

```ts
const myCalc = emptyPipe<number, string>()
    .next(map(v => 10 / 2))
    .next(map(
        v => v * 2,
        error => {
            console.error(error);
            return 0;
        }
    ))
    .catch(error => {
        console.error(error);
        return 'cannot divide by zero'
    });
```

## forSteps/forStepsAsync

Creates a new pipe with a list of steps. It is a shortcut to add multiple steps at once. `catch` adds a error handler to the pipe and `catchDefault` creates a error handler that returns a default value. `create` is used to create the lazy pipe.

```ts
const myCalc = forSteps(
    map((v: number) => 10 / v),
    map(v => v * 2),
    map(v => v + 1)
).catchDefault('cannot divide by zero')
 .create();
```