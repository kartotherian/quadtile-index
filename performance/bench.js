'use strict';

let Benchmark = require('benchmark');
let suite = new Benchmark.Suite();
let qidx = require('..');

let ind = 1 << 10;

legacyXyToIndex(ind, ind, 15);
xyToIndex(ind, ind, 15);
legacyIndexToXY(ind);
indexToXY(ind);

suite
    .add('legacy#xyToIndex', function() {
        legacyXyToIndex(ind, ind, 15);
    })
    .add('xyToIndex', function() {
        qidx.xyToIndex(ind, ind, 15);
    })
    // .add('new#xyToIndex', function() {
    //     xyToIndex(ind, ind, 15);
    // })
    // .add('new#xyToIndex2', function() {
    //     xyToIndex2(ind, ind, 15);
    // })
    // .add('legacy#indexToXY', function() {
    //     legacyIndexToXY(ind);
    // })
    // .add('new#indexToXY', function() {
    //     indexToXY(ind);
    // })
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    .run();


function legacyXyToIndex(x, y, zoom) {
    if (!qidx.isValidCoordinate(x, zoom) || !qidx.isValidCoordinate(y, zoom)) {
        throw new Error(`Invalid X,Y coordinates ${x}, ${y}`);
    }
    let mult = 1, result = 0;
    while (x || y) {
        result += (mult * (x % 2));
        x = Math.floor(x / 2);
        mult *= 2;
        result += (mult * (y % 2));
        y = Math.floor(y / 2);
        mult *= 2;
    }
    return result;
}

/**
 * Convert a single integer into the x,y coordinates
 * Given an integer, extract every odd/even bit into two integer values
 */
function legacyIndexToXY(index) {
    if (!qidx.isValidIndex(index)) {
        throw new Error(`Invalid index ${index}`);
    }
    let x = 0, y = 0, mult = 1;
    while (index) {
        x += mult * (index % 2);
        index = Math.floor(index / 2);
        y += mult * (index % 2);
        index = Math.floor(index / 2);
        mult *= 2;
    }
    return [x, y];
}

function xyToIndex(x, y, zoom) {
    if (!qidx.isValidCoordinate(x, zoom) || !qidx.isValidCoordinate(y, zoom)) {
        throw new Error(`Invalid X,Y coordinates ${x}, ${y}`);
    }
    return expandEven26(x & (1 << 14) - 1) + expandEven26((x & (1 << 14) - 1 << 13) >> 13) * (1 << 26) +
        expandEven26(y & (1 << 14) - 1) * 2 + expandEven26((y & (1 << 14) - 1 << 13) >> 13) * (1 << 27);
}

function xyToIndex2(x, y, zoom) {
    if (!qidx.isValidCoordinate(x, zoom) || !qidx.isValidCoordinate(y, zoom)) {
        throw new Error(`Invalid X,Y coordinates ${x}, ${y}`);
    }
    let result = expandEven26(x & (1 << 13) - 1) + expandEven26(y & (1 << 13) - 1) * 2;
    if (x >= 1 << 12) result += expandEven26((x & (1 << 13) - 1 << 13) >> 13) * (1 << 26);
    if (y >= 1 << 12) result += expandEven26((y & (1 << 13) - 1 << 13) >> 13) * (1 << 27);
    return result;
}

/**
 * Convert a single integer into the x,y coordinates
 * Given an integer, extract every odd/even bit into two integer values
 */
function indexToXY(index) {
    if (!qidx.isValidIndex(index)) {
        throw new Error(`Invalid index ${index}`);
    }
    if (index < (1<<26)) {
        return [compactEven26(index), compactEven26(index >> 1)];
    }
    let low = (index % (1<<26)) | 0,
        high = (index / (1<<26)) | 0;
    return [compactEven26(high) * (1<<13) + compactEven26(low),
        compactEven26(high >> 1) * (1<<13) + compactEven26(low >> 1)];
}


/**
 * Fast function to extract all even (0th, 2nd, 4th, ..., 24th) bits, and compact them together
 * into a single 13bit number (0->0, 2->1, 4->2, ..., 24->12).
 * @param {number} value integer within the range 0..2^26-1
 * @return {number}
 */
function compactEven26(value) {
    // value = value | 0;
    return (value & 1)
        | (value & 1 << 2) >> 1
        | (value & 1 << 4) >> 2
        | (value & 1 << 6) >> 3
        | (value & 1 << 8) >> 4
        | (value & 1 << 10) >> 5
        | (value & 1 << 12) >> 6
        | (value & 1 << 14) >> 7
        | (value & 1 << 16) >> 8
        | (value & 1 << 18) >> 9
        | (value & 1 << 20) >> 10
        | (value & 1 << 22) >> 11
        | (value & 1 << 24) >> 12;
}

/**
 * Fast function to extract first 13 bits and expand them to use every other bit slot,
 * into a 26bit number (0->0, 1->2, 2->4, ..., 12->24).
 * @param {number} value integer within the range 0..2^13-1
 * @return {number}
 */
function expandEven26(value) {
    value = value | 0;
    return (value & 1)
        | (value & 1 << 1) << 1
        | (value & 1 << 2) << 2
        | (value & 1 << 3) << 3
        | (value & 1 << 4) << 4
        | (value & 1 << 5) << 5
        | (value & 1 << 6) << 6
        | (value & 1 << 7) << 7
        | (value & 1 << 8) << 8
        | (value & 1 << 9) << 9
        | (value & 1 << 10) << 10
        | (value & 1 << 11) << 11
        | (value & 1 << 12) << 12;
}
