"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class TempBlobsNullClientV1 {
    constructor(config) { }
    getBlobInfosByFilter(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_2.DataPage());
    }
    getBlobInfosByIds(correlationId, blobIds, callback) {
        callback(null, []);
    }
    getBlobInfoById(correlationId, blobId, callback) {
        callback(null, null);
    }
    getBlobUriById(correlationId, blobId, callback) {
        callback(null, null);
    }
    writeBlobAsObject(correlationId, data, timeToLive, callback) {
        if (callback)
            callback(null, pip_services3_commons_node_1.IdGenerator.nextLong());
    }
    readBlobAsObject(correlationId, blobId, callback) {
        callback(null, null);
    }
    writeBlobConditional(correlationId, data, timeToLive, callback) {
        let envelop = {
            data: data
        };
        if (callback)
            callback(null, envelop);
    }
    readBlobConditional(correlationId, envelop, callback) {
        if (envelop.data != null) {
            callback(null, envelop.data);
        }
        else {
            callback(null, null);
        }
    }
    writeBlobToStream(correlationId, timeToLive, callback) {
        if (callback)
            callback(null, pip_services3_commons_node_1.IdGenerator.nextLong());
    }
    readBlobFromStream(correlationId, blobId, callback) {
        callback(null, null, null);
    }
    extendBlob(correlationId, blobId, timeToLive, callback) {
        if (callback)
            callback(null);
    }
    deleteBlobById(correlationId, blobId, callback) {
        if (callback)
            callback(null);
    }
    deleteBlobsByIds(correlationId, blobIds, callback) {
        if (callback)
            callback(null);
    }
}
exports.TempBlobsNullClientV1 = TempBlobsNullClientV1;
//# sourceMappingURL=TempBlobsNullClientV1.js.map