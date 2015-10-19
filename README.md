# Tc-39 suggesting: promise.all result not limited to an Array

## intro

Initially just putting out feelers for a smalls suggestion to the implementation of `promise.all`.

## Problem

`Promise.all` can take any object that implements the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), such as the in built Map and Array types. However the result of `promise.all` is always passed an array of values from all the promises. It is my feeling this type change from input to output compromises the purity of the Promise abstraction.

For instance, given:

```
// Gets a random number, at a randomly later time (different Math.random seed)
var extraRandom = function (callback) {
  setTimeout(function () {
    callback(Math.random() * 1000);
  }, Math.random() * 1000 );
};

// Promises a random number, at a randomly later time
var promiseExtraRandom = function () {
    return new Promise(function (done) {
      extraRandom(done);
    }
};

var dataStore = new Map();
dataStore.set('player1', promiseExtraRandom());
dataStore.set('player2', promiseExtraRandom());

// Here the dataStore is treated like an Object..
dataStore.forEach(function (val, key) {
  console.log('Getting random number for '+key);
});

// ...though of course dataStore is an iterator
for (let key of dataStore) {
  console.log('Re-iterating, getting number for '+key);
}

var dataStoreDone = Promise.all(dataStore);

```


## Current situation

Currently the `result` argument passed to the subsequent `then()` call is an Array, destroying the key-to-value representation:

```
dataStoreDone.then(function (result) {
  (result[0] > result[1]) ? 'Somebody won' : 'Someone won');
});
```

## Proposed solution

Now when the dataStore is done, I'd like to interact with it in the same way - being able to easily iterate with access to value _and keys_.

```
dataStoreDone.then(function (result) {
  var winner = {val:0, key: null};
  result.forEach(function (val, key) {
    if (val > winner.val) {
      winner.key = key;
    }
  });
  console.log(JSON.stringify(winner, null, 2));
});
    
```

## Current possible solution

The programe could be changed to use Arrays and destructuring, thus using the index-to-value representation:

```
var dataStore = [promiseExtraRandom(), promiseExtraRandom()];

dataStore.then(function (players) {
  console.log((players[0]) ? 'Player 1 won' : 'Player 2 won');
});
```

Thus this proposal hinges upon the judgement on what is lost when `Promise.all` loses the input's key-to-value representation, in the outputted result.

## Complications, and overview of solution

Because the iterator protocol could be implemented in an arbitrary (aka unexpected) way by an object, it cannot be anticipated. However, for in-built types, the behavior is known. Thus, given an iteractor input, `Promise.all` could return a result of the same type (with the same characterstics).

## Next steps

_Create an implementation_
