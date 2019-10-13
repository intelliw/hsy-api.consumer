//@ts-check
"use strict";
/**
 * ./producers/MonitoringMppt.js
 *  Kafka mppt message producers for api devices.datasets.post 
 */
const consts = require('../host/constants');
const enums = require('../host/enums');

const configc = require('../common/configc');

const BqProducer = require('./BqProducer');
const KafkaProducer = require('../producers/KafkaProducer');

const KAFKA_WRITE_TOPIC = configc.env[configc.env.active].topics.dataset.mppt;
const BQ_DATASET = configc.env[configc.env.active].datawarehouse.datasets.monitoring;
const BQ_TABLE = configc.env[configc.env.active].datawarehouse.tables.mppt;


/**
 */
class DatasetMppt extends KafkaProducer {
    /**
    instance attributes:  

     constructor arguments  
    */
    constructor() {

        // construct super
        super(KAFKA_WRITE_TOPIC);

        // instance attributes
        this.bqClient = new BqProducer(BQ_DATASET, BQ_TABLE);                         // $env:GOOGLE_APPLICATION_CREDENTIALS="C:\_frg\_proj\190905-hse-api-consumer\credentials\sundaya-d75625d5dda7.json"      

    }


}



module.exports = DatasetMppt;