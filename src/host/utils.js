//@ts-check
'use strict';
/**
 * PACKAGE: ./host/index.js
 * schemas and constants
 * utils.js is from api host - any changes should be mastered in api host utils.js -----------------------------------------
 */
const enums = require('./enums');
const consts = require('../host/constants');

const moment = require('moment');

// capitalise first letter of first word or all words
module.exports.capitalise = (str, allWords) => {

    const SPACE_DELIMITER = ' ';
    let outStr = '';

    allWords = allWords || false;                                   // if true all words are capitalised

    if (allWords) {
        let words = str.split(SPACE_DELIMITER);                     // get the words

        words.forEach(word => {
            outStr += word.charAt(0).toUpperCase() + word.slice(1) + SPACE_DELIMITER;
        });
        outStr = outStr.trim();

    } else {
        outStr = str.charAt(0).toUpperCase() + str.slice(1);
    }

    return outStr;
};

/**
 * returns a number sequence (e.g. days of the month '01 02 ..' etc) in a delimited string with zero pads
 * howMany is the number of numbers to output including the startNum 
 * prefix is an optional lead string, set it to undefined if no prefix is needed 
 * pad is a boolean for whether to pad - default is true 
 *  if provided it is prepended to the sequence to optimise performance by reducing the iterations needed 
 * e.g. startNum = 1, howMany = 10, delimiter = " ", prefix = '01 02 03 04 05 06 07'
 *  ->  '01 02 03 04 05 06 07 08 09 10'
*/
module.exports.createSequence = (startNum, howMany, delimiter, prefix, pad) => {

    const PAD_ZERO = "0";

    let zerosToPad; let digits; let num;
    
    pad = pad ? pad : true;
    let seqStr = prefix !== consts.NONE? prefix.trim() : "";                      // prepend prefix if provided
    let maxNum = Number(startNum) + (howMany - 1);
    let maxDigits = maxNum.toString().length;

    let i;
    seqStr += (howMany > 0) && (prefix !== consts.NONE) ? delimiter : "";
    for (i = startNum; i <= maxNum; i++) {

        num = i.toString();
        zerosToPad = pad ? maxDigits - num.length : 0;
        
        seqStr += PAD_ZERO.repeat(zerosToPad) + num + (i <= maxNum - 1 ? delimiter : "");
    }

    return seqStr.trim();

}


// returns an array of numbers
module.exports.createNumberSequence = (startNum, howMany) => {

    let seqNum = [];
    let maxNum = startNum + (howMany - 1);

    for (let i = startNum; i <= maxNum; i++) {
        seqNum.push(i);
    }
    return seqNum;
}

/* converts and formats a localtime or UTC instant, to Local time. Returns a datetime in the specified return format
   the function may be called with one of the following options:
   1) instant is local time with +/- UTC offset (e.g. 20190209T1630+0700). 
    - the instant is simply formatted and returned, as local time including the trailing +/- offset 
   2) instant is in UTC time with the required offsetHours parameter - (e.g. 20190209T1630Z and '7.5')
    - offsetHours must be a float value which provides fractional hours offset from UTC (e.g. 7.5 for +0730, and -7.5 for -0730). 
    - the local time is calculated by adding the (positive or negative) offset in hours, to the UTC instant, with +00:00 as the offset 
    - if offsetHourse is missing or invalid ..assume zero offset hours (i.e the instant *is* 'local' UTC time)
    an empty value is returned if:
    - the instant does not contain a trailing +/- offset, and the instant is not in UTC format (no trailing 'Z')    
*/
module.exports.datetimeToLocal = (instant, returnUtcFormat, offsetHours) => {

    let offsetSubstringStart = -1;
    let zuluStart = -1;
    let localTime;

    const INVALID_INSTANT = '';

    // get start of trailing +/- offset substring or 'Z' in the input instant                                               
    offsetSubstringStart = instant.indexOf('-');                                                    // the instant must have a +/- offset
    if (offsetSubstringStart <= 0) offsetSubstringStart = instant.indexOf('+');
    if (offsetSubstringStart <= 0) zuluStart = instant.toUpperCase().indexOf('Z');                  // check if Z has been specified 

    // if it is a local time with a trailing +/- offset 
    if (offsetSubstringStart > 0) {

        localTime = moment.parseZone(instant).format(returnUtcFormat)                               // e.g. "2019-02-09T15:00:17.0200+07:00"

        // if UTC time convert instant to a 'local' UTC time with +00:00 offset
    } else if (zuluStart > 0) {

        // get float value of offsetHours - if offsetHours is missing or not valid assume 0
        offsetHours = (offsetHours === "" || offsetHours == consts.NONE || isNaN(offsetHours)) ? 0 : parseFloat(offsetHours)

        // add-subtract the offset
        localTime = moment.utc(instant).add(offsetHours, 'hours').format(returnUtcFormat);

        // if not a local time or UTC time -  return an 'invalid' empty string response 
    } else {

        localTime = INVALID_INSTANT;                                                                // return empty string to signify an invalid instant

    }

    return localTime;                                                                               // return formatted 

}

/*  converts an instant to UTC time and returns a datetime in the format specified by returnUtcFormat.
    the input instant can be 
    - a local time with a trailing +/- offset (e.g. 20190209T150017.020+0700) 
    - or UTC time  with a trailing z
    an empty value is returned if: 
    - the instant does not contain a trailing +/- offset or a trailing 'Z'  
*/
module.exports.datetimeToUTC = (instant, returnUtcFormat) => {

    let offsetSubstringStart = -1;
    let zuluStart = -1;
    let utcTime = '';

    const INVALID_INSTANT = '';

    // get start of trailing +/- offset substring or 'Z' in the input instant                                               
    offsetSubstringStart = instant.indexOf('-');                                                    // the instant must have a +/- offset
    if (offsetSubstringStart <= 0) offsetSubstringStart = instant.indexOf('+');
    if (offsetSubstringStart <= 0) zuluStart = instant.toUpperCase().indexOf('Z');                      // check if Z has been specified 


    // if it is a local time with a trailing +/- offset (e.g. 20190209T150017.020+0700) or UTC time  with a trailing z
    if (offsetSubstringStart > 0 || zuluStart > 0) {

        utcTime = moment.utc(instant).format(returnUtcFormat);                                          // convert instant to a 'local' UTC time with +00:00 offset

        // if not a local time or UTC time -  return an 'invalid' empty string response 
    } else {

        utcTime = INVALID_INSTANT;                                                                // return empty string to signify an invalid instant

    }

    return utcTime;
}

// pads leading zeros if the number is less than the width
module.exports.padZero = (n, width) => {
    let z = '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/**
 * searches through the findInObjectArray and finds the first item with a property equal to the findValue 
 * if findAll is true the function will return all the items which match the findvalue, otherwise only the first 
 */
module.exports.findByPropertyValue = (findInObjectArray, findProperty, findValue, findAll) => {

    const EXITFOR = findInObjectArray.length;

    let n;
    let foundItems = [];
    let item;
    let all = findAll ? findAll : false;

    for (n = 0; n < findInObjectArray.length; n++) {

        item = findInObjectArray[n];

        if (item[findProperty] === findValue) {
            foundItems.push(item);
            // quit after the first if all were not requested
            if (!all) {
                n = EXITFOR;
            }

        }
    }

    return foundItems;
}
// returns the index of the first property with a matching value. Returns -1 if missing. 
module.exports.indexFromValue = (obj, value) => {

    const index = Object.values(obj).indexOf(value);
    return index;

}
// returns the key name of the first property with a matching value. Can be used to retrieve an enum key from its value
module.exports.keynameFromValue = (obj, value) => {

    const keyname = Object.keys(obj)[this.indexFromValue(obj, value)];
    return keyname;

}

// returns true if a property with a matching value exists in the object. Can be used to check if a value exists in an enum
module.exports.valueExistsInObject = (obj, value) => {

    const MISSING = -1;

    const exists = this.indexFromValue(obj, value) != MISSING;
    return exists;

}

//returns whether the findValue exists at least once in the findInArray
module.exports.valueExistsInArray = (findInArray, findValue) => {

    const EXITFOR = findInArray.length;

    let n;
    let exists = false;
    for (n = 0; n < findInArray.length; n++) {
        if (findInArray[n] === findValue) {
            exists = true;
            n = EXITFOR;
        }
    }

    return exists;
}

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
// calls randomFloat() and padZer()
module.exports.randomIntegerString = (min, max) => {

    const ZERO_DECIMAL_PLACES = 0;
    
    // get a random number 
    let maxLength = max.toString().length;               
    let randomInt = this.randomFloat(min, max, ZERO_DECIMAL_PLACES);
    let randomIntStr = randomInt.toString().substring(0,maxLength);

    // pad zeros if shorter than max 
    return this.padZero(randomIntStr, maxLength);

}


// returns true at random. This was needed to limit the periods which are outputted fior 'instant' to simulate real-life data logging
module.exports.randomTrue = () => {

    let randomTrue; let randomnum;
    const max = 30;                                                     // the larger this number the more skips there will be  
    const random_match = 5;                                             // this can be any number less than MOCK_max

    randomnum = Number(this.randomFloat(1, max, 0));                    // get a random integer between 1 and MOCK_max
    randomTrue = (randomnum == random_match) ? false : true;            // skip unless there is a match

    return randomTrue;                                                  // return whether to skip  

}

/**
 * searches the findIn array for the first occurrence of an item in the find array. 
 * The items in the find array need to be in order of preference. The first match wil be returned.
 * if there are no matches and defaultIfNotFound is true, the first item in the findIn array will be returned as the default. 
 */
module.exports.selectFirstMatch = (findInCVL, find, defaultIfNotFound) => {

    let selectedItem;

    if (findInCVL && find) {

        const EXITFOR = findInCVL.length;

        let n;
        for (n = 0; n < findInCVL.length; n++) {
            if (find.includes(findInCVL[n])) {                              // if the value matches    
                selectedItem = findInCVL[n];                                // set the found item 
                n = EXITFOR;                                                // exit the loop
            }
        }

        selectedItem = !selectedItem && defaultIfNotFound ? findInCVL[0] : selectedItem;        // if the item was not found set default to first item in findIn
    }
    return selectedItem;
}

// returns a min and max value for the average energy consumed in this period
module.exports.MOCK_periodMinMax = (period, dailyHigh, dailyLow) => {

    const DAY_DECIMAL_PLACES = 3;                                           // 3 decimals
    let minmax = { min: dailyHigh, max: dailyLow, precision: DAY_DECIMAL_PLACES };

    let multiplier = 1; let decimalPlaces = DAY_DECIMAL_PLACES;
    switch (period.value) {
        case enums.period.instant:
            multiplier = 0.0000000116;
            decimalPlaces = 12;
            break;
        case enums.period.second:
            multiplier = 0.0000115741;
            decimalPlaces = 9;
            break;
        case enums.period.minute:
            multiplier = 0.0006944444;
            decimalPlaces = 9;
            break;
        case enums.period.hour:
            multiplier = 0.0416666667;
            decimalPlaces = 6;
            break;
        case enums.period.timeofday:
            multiplier = 0.2500000000;
            decimalPlaces = 3;
            break;
        case enums.period.week:
            multiplier = 7.0000000000;
            decimalPlaces = 3;
            break;
        case enums.period.month:
            multiplier = 31.0000000000;
            decimalPlaces = 3;
            break;
        case enums.period.quarter:
            multiplier = 124.0000000000;
            decimalPlaces = 3;
            break;
        case enums.period.year:
            multiplier = 365.0000000000;
            decimalPlaces = 3;
            break;
        case enums.period.fiveyear:
            multiplier = 1825.0000000000;
            decimalPlaces = 3;
            break;
        case enums.period.day:
        default:
            multiplier = 1.000;
            decimalPlaces = 3;
            break;
    }
    minmax.min = dailyLow * multiplier;
    minmax.max = dailyHigh * multiplier;
    minmax.precision = decimalPlaces;

    return minmax;
}


// test... node src/host/utils
// console.log(this.randomIntegerString(1,999));