//@ts-check
"use strict";
/**
 * ./consumers/BqPms.js
 *  
 */

const enums = require('../host/enums');
const consts = require('../host/constants');

const utilsc = require('../host/utilsCommon');
const configc = require('../host/configCommon');

const Producer = require('../producers');
const KafkaConsumer = require('../consumers/KafkaConsumer');

// instance parameters
const KAFKA_READ_TOPIC = configc.env[configc.env.active].topics.monitoring.inverter;
const KAFKA_CONSUMER_GROUPID = enums.messageBroker.consumers.groupId.inverter;


/**
 * instance attributes
 * producer                                                                             //  e.g. DatasetInverter - producer object responsible for transforming a consumed message and if requested, sending it to a new topic  
 constructor arguments 
 */
class MonitoringInverter extends KafkaConsumer {

    /**
    instance attributes, constructor arguments  - see super
    */
    constructor() {

        // start kafka consumer with a bq client
        super(
            KAFKA_CONSUMER_GROUPID,
            KAFKA_READ_TOPIC
        );

        // instance attributes
        this.producer = new Producer.DatasetInverter()

    }

    // subtype implements specific transforms or calls super 
    transform(consumedMessage) {
        return super.transformMonitoringDataset(consumedMessage);
    }

    /* writes to bq and to the datasets kafka topic 
     * the transformResults object contains an array of kafka messages with modified data items
     *      e.g. transformResults: { itemCount: 9, messages: [. . .] }
    */
    produce(transformResults) {

        // produce 
        transformResults.messages.forEach(message => {

            // bq
            this.producer.bqClient.insertRows(message.value);

        });

        // write to kafka 
        // this.producer.sendToTopic(transformResults); // remove comment if this is needed


    }


    /* transforms and returns a data item specific to this dataset
     dataSet        - e.g. { "pms": { "id": "PMS-01-001", "temp": 48.3 },     
     dataItem       - e.g. "data": [ { "time_local": "2
    */
   transformDataItem(key, dataSet, dataItem) {


        let volts, amps, watts, pf;
        let attrArray;

        const PRECISION = consts.system.MONITORING_PRECISION;
        const ITEMNUMBER_LENGTH = 2;                                                                // how many digits int he cell number e.g 02
        const SQ_ROOT_OF_THREE = Math.sqrt(3);

        //  reconstruct dataitem - add new attributes and flatten arrays 
        let dataObj = {
            inverter_id: key,
            time_local: dataItem.time_local                                                         // this gets replaced and deleted in addGenericAttributes()
        }

        // pv
        attrArray = [];
        for (let i = 1; i <= dataItem.pv.volts.length; i++) {
            volts = dataItem.pv.volts[i - 1];
            amps = dataItem.pv.amps[i - 1];
            watts = (volts * amps).toFixed(PRECISION);

            attrArray.push({ volts: volts, amps: amps, watts: parseFloat(watts) });
        };
        dataObj.pv = attrArray;                                                                     // "pv": [ {"volts": 48, "amps": 6, "watts": 288 },

        // battery
        volts = dataItem.battery.volts;
        amps = dataItem.battery.amps;
        watts = (volts * amps).toFixed(PRECISION);

        dataObj.battery = {                                                                         //   "battery": {
            volts: volts, amps: amps, watts: parseFloat(watts)                                      //      "volts": 55.1, "amps": 0.0, "watts": 0 },
        }

        // load
        attrArray = [];
        for (let i = 1; i <= dataItem.load.volts.length; i++) {
            volts = dataItem.load.volts[i - 1];
            amps = dataItem.load.amps[i - 1];
            watts = (volts * amps).toFixed(PRECISION);

            attrArray.push({ volts: volts, amps: amps, watts: parseFloat(watts) });
        };
        dataObj.load = attrArray;                                                                   // "load": [ {"volts": 48, "amps": 6, "watts": 288 },


        // grid
        attrArray = [];
        for (let i = 1; i <= dataItem.grid.volts.length; i++) {
            attrArray.push({ 
                volts: dataItem.grid.volts[i - 1],
                amps: dataItem.grid.amps[i - 1],
                pf: dataItem.grid.pf[i - 1],
                watts: (volts * amps * pf * SQ_ROOT_OF_THREE).toFixed(PRECISION)                    // grid.watts == V x I x pf x √3  
            });
        };
        dataObj.grid = attrArray;           

        // status
        let statusBits = utilsc.hex2bitArray(dataItem.status, consts.equStatus.BIT_LENGTH);         // get a reversed array of bits (bit 0 is least significant bit)
        dataObj.status = {
            bus_connect: utilsc.tristateBoolean(statusBits[0])                                      // bit 0    "status": { "bus_connect": true }, 
        }

        // add generic attributes
        dataObj.sys = { source: dataItem.sys.source }
        dataObj.time_event = dataItem.time_event
        dataObj.time_zone = dataItem.time_zone
        dataObj.time_processing = dataItem.time_processing

        return dataObj;

    }


}


module.exports = MonitoringInverter;