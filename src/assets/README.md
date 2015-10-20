# Tc-39 suggesting: type of promise.all result extended from Array to any in-built Javascript iterator

## intro

Initially just putting out feelers for a smalls suggestion to the implementation of `promise.all`.

## Problem

`Promise.all` can take any object that implements the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), such as the in built Map and Array types. However the result of `promise.all` is always passed an array of values from all the promises. It is my feeling this type change from input to output compromises the purity of the Promise abstraction.

For instance, given:

```javascript
--text-embed:./src/readme/00-problem.js::lines:13-27
```

A simple game could be created by loading a pair of promises into an iterator. The iterator could be passed to `Promise.all`, and the subsequent result can be examined to find the highest random number a.k.a the "winner".

## Current situation

Currently the `result` argument passed to the subsequent `then()` call is an Array, destroying the key-to-value representation:

```javascript
--text-embed:./src/readme/01-current-situation.js::lines:43-51
```

## Proposed solution

Now when the dataStore is done, I'd like to interact with it in the same way - being able to easily iterate with access to value _and keys_.

```javascript
--text-embed:./src/readme/02-proposed-solution.js::lines:55-68
```

## Current alternative solution

The programe could be changed to use Arrays and destructuring, thus using the index-to-value representation:

```javascript
--text-embed:./src/readme/03-current-possible-solution.js::lines:32-39
```

Thus this proposal hinges upon the judgement on what is lost when `Promise.all` loses the input's key-to-value representation, in the outputted result.

## Complications, and overview of solution

Because the iterator protocol could be implemented in an arbitrary (aka unexpected) way by an object, it cannot be anticipated. However, for in-built types, the behavior is known. Thus, given an iteractor input, `Promise.all` could return a result of the same type (with the same characterstics).

## Next steps

_Create an implementation_
