//@ts-check
"use strict";
/**
 * ./consumers/Bq.js
 *  base type for BigQuery client  
 */
const enums = require('../environment/enums');
const env = require('../environment/env');
const log = require('../logger').log;

const moment = require('moment');

const { BigQuery } = require('@google-cloud/bigquery');

const Storage = require('./Storage');

class BqStorage extends Storage {
    /**
     constructor arguments 
    * @param {*} dataset                                                    //  env.active.datawarehouse.datasets   - e.g. monitoring
    * @param {*} table                                                      //  env.active.datawarehouse.tables   - e.g. pms
    */
    constructor(dataset, table) {

        // create the bq client
        const storageObj = new BigQuery();                                     // $env:GOOGLE_APPLICATION_CREDENTIALS="C:\_frg\_proj\190905-hsy-api-consumer\credentials\sundaya-d75625d5dda7.json"
        storageObj.projectId = env.active.gcp.project;                   // e.g. sundaya-dev
        

        // setup instance variables specific to PubSubPublisher 
        super(storageObj);

        this.dataset = dataset;                                             // e.g. monitoring
        this.table = table;                                                 // e.g. mppt

    }

    
    /* insert rows into Bigquery. rows is an array of data objects
     * the sharedId is common to all rtows in the array, and is needed for logging
     */
    async write(sharedId, rowArray) {

        // log out data before trying insert                                // e.g. [monitoring.dev_pms] id: TEST-09, 1 rows
        log.data(this.dataset, this.table, sharedId, rowArray);
        
        // [start trace] -------------------------------
        const sp = log.SPAN.createChildSpan({ name: `${log.enums.methods.bqInsertRows}` });


        // write to bq
        await rowArray.forEach(row => {                                     // rowArray = [{"pms_id":"PMS-01-002","pack_id":"0248","pack":{"volts":51.262,"amps":-0.625,"watts":-32.039,"vcl":3.654,"vch":3.676,"dock":4,"temp_top":35,"temp_mid":33,"temp_bottom":34},"cell":[{"volts":3.661,"dvcl":7,"open":false},{"volts":3.666,"dvcl":12,"open":false},{"volts":3.654,"dvcl":0,"open":false},{"volts":3.676,"dvcl":22,"open":false},{"volts":3.658,"dvcl":4,"open":false},{"volts":3.662,"dvcl":8,"open":false},{"volts":3.66,"dvcl":6,"open":false},{"volts":3.659,"dvcl":5,"open":false},{"volts":3.658,"dvcl":4,"open":false},{"volts":3.657,"dvcl":3,"open":false},{"volts":3.656,"dvcl":2,"open":false},{"volts":3.665,"dvcl":11,"open":true},{"volts":3.669,"dvcl":15,"open":false},{"volts":3.661,"dvcl":7,"open":false}],"fet_in":{"open":true,"temp":34.1},"fet_out":{"open":false,"temp":32.2},"status":{"bus_connect":true},"sys":{"source":"S000"},"time_event":"2019-02-09 08:00:17.0200","time_zone":"+07:00","time_processing":"2019-09-08 05:00:48.9830"}]
            this.storageObj
                .dataset(this.dataset)
                .table(this.table)
                .insert(row)
                .catch(e => log.error(`${log.enums.methods.bqInsertRows} Error  [${this.dataset}.${this.table}]`, e))
        });

        
        // [end trace] ---------------------------------
        sp.endSpan();

    }

}

module.exports = BqStorage;