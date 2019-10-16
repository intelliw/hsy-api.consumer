//@ts-check
'use strict';
/**
 * PACKAGE: ./common/utilsc.js
 * shared utilities
 * these utilities are shared between host anmd consumer 
 * 
 * utilsc.js is from api host - any changes should be mastered in api host src/commom/utilsc.js -----------------------------------------
 */

const consts = require('../host/constants');


// returns a random number between min and max with decimal places based on precision 
module.exports.randomFloat = (min, max, decimalPlaces) => {

    const precision = 1 * Math.pow(10, decimalPlaces);                      // e.g. 3 decimals = 1000000
    min = min * precision;                                                  // adjust before dividing for decimal place
    max = max * precision;

    let random = (Math.floor(Math.random() * max) + min) / precision;       //generate a random number with the required precision
    let randomFixed = random.toFixed(decimalPlaces);                        // fix the decimal places including trailing zeros which may be missing in 'random'

    return randomFixed;

}

// returns a fixed length string from a random integer between min and max, paded with leading zeros if the number has less digits than the number of digits in max.
// calls randomFloat() 
module.exports.randomIntegerString = (min, max) => {

    const ZERO_DECIMAL_PLACES = 0;

    // get a random number 
    let minLength = max.toString().length;
    let randomInt = this.randomFloat(min, max, ZERO_DECIMAL_PLACES);
    let randomIntStr = randomInt.toString().substring(0, minLength);

    // pad zeros if shorter than max 
    return randomIntStr.padStart(minLength, '0');

}


/* converts a hex value to an array of reversed bits, the least-significant-bit (rightmost bit) is in element zero       
    if hexValue is undefined an array of null values is returned
*/
module.exports.hex2bitArray = (hexValue, minLength) => {
    const hexBase = 16;
    const binaryBase = 2;

    let bitArray = [];

    // process  if hexValue is valid
    if (hexValue != consts.NONE) {

        // convert hex to binary - e.g. 1A79 --> 0001 1010 0111 1001
        let binaryValue = parseInt(hexValue, hexBase).toString(binaryBase).padStart(minLength, '0');

        // reverse the array - e.g  bitArray[0] = 1, bitArray[1] = 0          
        bitArray = binaryValue.split('').reverse();

        // if hexValue is invalid return null array
    } else {
        bitArray = new Array(minLength).fill(null);
    }

    return bitArray;
}


/* returns ifZero, ifOne or null 
   depending on whether bitValue is 0, 1, or null/invalid
   the parameters ifZero and ifOne correspond to a bitvalue of 0 or 1 respectively 
*/
module.exports.tristateBoolean = (bitValue, ifZero, ifOne) => {

    let tristate = null;

    // return true/false if bitValue is 1,0
    if (bitValue == 1) {
        tristate = ifOne;
    } else if (bitValue == 0) {
        tristate = ifZero;
    }

    return tristate;
}

