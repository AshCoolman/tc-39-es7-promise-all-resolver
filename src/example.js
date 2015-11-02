import promiseAllMatchIterator from './promise-all-match-iterable';

export default function ( useIterator, useProposed ) {
    console.log([
            [
                'Using Promise.all(',
                (useIterator ? '<Iterator>' : '<Array>'),
                ')',
                'and ',
                (useProposed ? 'IS ' : 'not '),
                'using proposed implementation'
            ].join(''),
        ].join('\n'));

    // Milliseconds now
    var now = function () {
        return (new Date()).valueOf();
    };

    // Async random generator:
    var extraRandom = function (callback) {
        let start = now();
        let doCallback = function () {
            callback(Math.random() * 10);
        };
        setTimeout(function() {
            doCallback( now() - start );
        },  Math.random() * 10);
    };

    // Promises a random number, at a randomly later time:
    var promiseExtraRandom = function () {
        return new Promise(function (done) {
            extraRandom(done);
        });
    };

    var dataStore, dataStoreDone;

    if (!useIterator) {
        // If you give `promise.all` an `Array`, the result will be an `Array`
        dataStore = [];
        dataStore.push(promiseExtraRandom());
        dataStore.push(promiseExtraRandom());
        dataStoreDone = Promise.all(dataStore).then( function (result) {
            var winner = ( result[0] > result[1] ) ? '1' : '2';
            console.log( '>> input:', Object.getPrototypeOf(dataStore), '>> output:', Object.getPrototypeOf(result));
            console.log( '>> Player at index "' + winner + '" won\n\n');
        });
    }

    if (useIterator && !useProposed) {
        // However if you give `promise.all` a `Map`, the result will _still_ be an `Array`
        dataStore = new Map();
        dataStore.set('Ryu', promiseExtraRandom());
        dataStore.set('Ken', promiseExtraRandom());
        dataStoreDone = Promise.all(dataStore).then( function (result) {
            var [ ryu, ken ] = result;
            var winner = ( ryu > ken ) ? 'Ryu (implied by result at index 1)' : 'Ken (implied by result at index 2)';
            console.log( '>> input:', Object.getPrototypeOf(dataStore), '>> output:', Object.getPrototypeOf(result));
            console.log( '>> "' + winner + '" won\n\n');
        });
    } 

    if (useIterator && useProposed) {
        // The proposal is for *in-built* iterators with expected behavior,
        // `promise.all` could take an in-built iterator, and the result would be an iterator of the same time
        dataStore = new Map();
        dataStore.set('Ryu', promiseExtraRandom());
        dataStore.set('Ken', promiseExtraRandom());
        dataStoreDone = promiseAllMatchIterator(dataStore).then( function (result) {
            var winner;
            result.forEach(function (val, key) {
                if ( !winner || val > winner.val ) {
                    winner = {val, key}; 
                }
            });
            console.log( '>> input:', Object.getPrototypeOf(dataStore), '>> output:', Object.getPrototypeOf(result));
            console.log( '>> The hero, "' + winner.key + '" won\n\n' );
        });
    }

        // Here the dataStore is treated like an Object..
        dataStore.forEach(function (val, key) {
            console.log('Brave "' + key + '" has entered the game.');
        });

    return dataStoreDone;
};