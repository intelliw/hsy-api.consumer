//@ts-check
"use strict";
/**
 * ./publishers/Publisher.js
 */

class Publisher {
    /**
     */
    constructor(publisherObj) {

        // setup instance variables
        this.publisherObj = publisherObj;

    }

    /** implemented by subtype
    * @param {*} msgObj               
    * @param {*} writeTopic 
    * @param {*} senderId                                                             // is based on the api key and identifies the source of the data. this value is added to 'sender' attribute 
    */
    async publish(msgObj, writeTopic, senderId) {
    }

}

module.exports = Publisher;
