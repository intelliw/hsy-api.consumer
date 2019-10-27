//@ts-check
'use strict';
/**
 * ./svc/enum.js
 * global enumerations
 */

module.exports.energyData = {
    hse: 'hse',
    harvest: 'harvest',
    storein: 'store.in',
    storeout: 'store.out',
    enjoy: 'enjoy',
    gridin: 'grid.in',
    gridout: 'grid.out'
}

// api parameter enumerations 
module.exports.params = {
    energy: {
        hse: 'hse',
        harvest: 'harvest',
        store: 'store',
        enjoy: 'enjoy',
        grid: 'grid'
    },
    period: {
        instant: 'instant',
        second: 'second',
        minute: 'minute',
        hour: 'hour',
        timeofday: 'timeofday',
        day: 'day',
        week: 'week',
        month: 'month',
        quarter: 'quarter',
        year: 'year',
        fiveyear: 'fiveyear'
    },
    datasets: {                                     // kafka topics are based on enums.params.datasets. preferred convention is <message type>_<api base/db name>_<dataset /table name> 
        pms: 'pms',                                 // corresponds to messageBroker.consumers.pms
        mppt: 'mppt',                               // corresponds to messageBroker.consumers.mppt
        inverter: 'inverter',                       // corresponds to messageBroker.consumers.inverter
    }
}
module.exports.params.energy.default = this.params.energy.hse;
module.exports.params.period.default = this.params.period.week;

// flags for feature toogles
module.exports.feature = {
    logging: 'logging'                              // logging reconfiguration feature
}

module.exports.timeOfDay = {
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
}

// request enumerations
module.exports.request = {
    headers: {
        contentType: 'content-type',
        apiKey: 'x-api-key'
    }
}

// mime types used in headers
module.exports.mimeType = {
    applicationCollectionJson: 'application/vnd.collection+json',
    applicationJson: 'application/json',
    textHtml: 'text/html',
    textPlain: 'text/plain',
    textCsv: 'text/csv'
}
module.exports.mimeType.default = this.mimeType.applicationCollectionJson;

// supported RFC8288 Link-relations for 'rel' property in Response objects
module.exports.linkRelations = {
    self: 'self',
    collection: 'collection',
    up: 'up',
    next: 'next',
    prev: 'prev'
}

// hypermedia link rendering values
module.exports.linkRender = {
    link: 'link',
    image: 'image',
    none: global.undefined
}
module.exports.linkRender.default = this.linkRender.none;

// http responses  
module.exports.responseStatus = {
    '200': 'OK',
    '201': 'Created',
    '204': 'Created',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '404': 'Not Found',
    '415': 'Unsupported Media Type',
    '500': 'Internal Server Error',
}

// api keys
module.exports.apiKey = {
    S000: 'AIzaSyD3IbFpxrydZuMKgEluHWDAvFl-P7dgPC8',
    S001: 'AIzaSyAZ4nuWP-ZXUg2aGQhrQjkvF2BFvukgv7w',    // Fahmi
    S002: 'AIzaSyDq97s15fdM99swOJuUIFtW8ifgQSBnymo',    // Adam 
    S003: 'AIzaSyBczHFIdt3Q5vvZq_iLbaU6MlqzaVj1Ue0',    // 
    V001: 'AIzaSyASFQxf4PmOutVS1Dt99TPcZ4IQ8PDUMqY',
    PROXY: 'AIzaSyC867McQRqoJFOsk27OYfnKjxSIp6WuaTA'    // PROXY - this default key is injected if none provided 
}
module.exports.apiKey.default = this.apiKey.PROXY;

// kafka
module.exports.messageBroker = {                    // kafka message broker. topics are based on enums.params.datasets. 
    consumerGroups: {                                            // consumer group ids
        monitoring: {
            pms: 'group.monitoring.pms',                    // group id convention = <target system>.<target dataset>.<target table>
            mppt: 'group.monitoring.mppt',
            inverter: 'group.monitoring.inverter'
        }, 
        system: {
            feature: 'group.system.feature'
        }
    },
    ack: {
        all: -1,                                    // -1 = all replicas must acknowledge (default) 
        none: 0,                                    //  0 = no acknowledgments 
        leader: 1                                   //  1 = only waits for the leader to acknowledge 
    }
}
module.exports.messageBroker.ack.default = this.messageBroker.ack.leader

// logging and error reporting framework 
module.exports.logging = {                           
    appenders: {                                    // output options for logging and error reporting      
        console: "console",
        stackdriver: "stackdriver"
    },
    statements: {                                   // determines which log statements will be included in log output 
        data: "data",
        error: "error",
        exception: "exception",
        messaging: "messaging",
        trace: "trace"
    },
    verbosity: {                                    // log levels for error reporting and logged events
        none: "none",
        info: "info",
        debug: "debug"
    }
}
// gcp project enumerations
module.exports.gcp = {           
    projects: {
        sundaya: "sundaya"
    }
}