/**
 * [Partial implementation[ A proposed implementation of the `Promise.all` function, 
 * that tries to resolve to a `result` which is the same type as the built-in iterable given as an input. 
 * If it can't match the type, it defaults to an array.
 * 
 * @see  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols#Builtin_iterables
 * Note: this is specific to the Q promise library that babel 6 uses.
 * 
 * @param  {<Iterator>} iterator Contains promises
 * @return {Promise}          Promise that resolves if all promises in `iterator` resolve, else rejects immediately (as per spec)
 */
export default function (iterator) {
    let hasDefaultIterableBehavior = function (iterator) {
        return true; // Not implemented yet
    };
    return Promise.all(iterator).then( function (result) {
        var payload = result;
        if (hasDefaultIterableBehavior(iterator)) {
            if (Object.getPrototypeOf(iterator) === Map.prototype) {
                var index = 0,
                    keys = iterator.keys(),
                    payload = new Map();
                for (let k of keys) {
                    let v = result[ index++ ];
                    payload.set( k, v );
                }
            } else if (Object.getPrototypeOf(iterator) === TypedArray.prototype) {
                throw new Error("promise-all-match-iterable - TypedArray not handled yet");
            } else if (Object.getPrototypeOf(iterator) === Set.prototype) {
                throw new Error("promise-all-match-iterable - Set not handled yet");
            }

        }
        return payload;
    });
};