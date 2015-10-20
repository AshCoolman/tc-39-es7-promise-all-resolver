import example from './example.js';

example().then(function () {
    example(true).then(function () {
        example(true, true).then(function () {

        });
    });
});