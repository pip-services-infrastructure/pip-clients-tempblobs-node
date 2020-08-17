"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const zlib = require('zlib');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class AbstractTempBlobsClientV1 {
    constructor(client) {
        this._maxObjectSize = 30 * 1024;
        this._compressionThreshold = 100 * 1024;
        this._client = client;
    }
    open(correlationId, callback) {
        let client = this._client;
        if (_.isFunction(client.open))
            client.open(correlationId, callback);
    }
    close(correlationId, callback) {
        let client = this._client;
        if (_.isFunction(client.close))
            client.close(correlationId, callback);
    }
    configure(config) {
        this._maxObjectSize = config.getAsLongWithDefault('options.max_object_size', this._maxObjectSize);
        this._compressionThreshold = config.getAsLongWithDefault('options.compression_threshold', this._compressionThreshold);
        let client = this._client;
        if (_.isFunction(client.configure))
            client.configure(config);
    }
    setReferences(references) {
        let client = this._client;
        if (_.isFunction(client.setReferences))
            client.setReferences(references);
    }
    toPublic(value) {
        return {
            id: value.id,
            size: value.size,
            create_time: value.create_time,
            expire_time: value.expire_time
        };
    }
    getBlobInfosByFilter(correlationId, filter, paging, callback) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        filter.setAsObject('group', 'temp');
        this._client.getBlobsByFilter(correlationId, filter, paging, (err, page) => {
            if (err != null || page == null) {
                callback(err, null);
                return;
            }
            let data = _.map(page.data, x => this.toPublic(x));
            let result = new pip_services3_commons_node_2.DataPage(data, page.total);
            callback(null, result);
        });
    }
    getBlobInfosByIds(correlationId, blobIds, callback) {
        this._client.getBlobsByIds(correlationId, blobIds, (err, blobs) => {
            if (err != null || blobs == null) {
                callback(err, null);
                return;
            }
            let result = _.map(blobs, x => this.toPublic(x));
            callback(null, result);
        });
    }
    getBlobInfoById(correlationId, blobId, callback) {
        this._client.getBlobById(correlationId, blobId, (err, blob) => {
            if (err != null || blob == null) {
                callback(err, null);
                return;
            }
            let result = this.toPublic(blob);
            callback(null, result);
        });
    }
    getBlobUriById(correlationId, blobId, callback) {
        this._client.getBlobUriById(correlationId, blobId, callback);
    }
    compressAndCreateBlob(correlationId, blob, buffer, callback) {
        if (buffer.length < this._compressionThreshold) {
            blob.name = blob.id + '.dat';
            blob.content_type = 'application/json';
            this._client.createBlobFromData(correlationId, blob, buffer, (err, blob) => {
                if (callback)
                    callback(err, blob != null ? blob.id : null);
            });
            return;
        }
        zlib.gzip(buffer, (err, buffer) => {
            if (err) {
                if (callback)
                    callback(err, null);
                return;
            }
            blob.name = blob.id + '.gzip';
            blob.content_type = 'application/x-gzip';
            blob.size = buffer.length;
            this._client.createBlobFromData(correlationId, blob, buffer, (err, blob) => {
                if (callback)
                    callback(err, blob != null ? blob.id : null);
            });
        });
    }
    readAndDecompressBlob(correlationId, blobId, callback) {
        this._client.getBlobDataById(correlationId, blobId, (err, blob, buffer) => {
            if (err != null || blob == null || buffer == null) {
                if (callback)
                    callback(err, null);
                return;
            }
            if (!blob.name.endsWith('.gzip')) {
                if (callback)
                    callback(null, buffer);
                return;
            }
            zlib.gunzip(buffer, callback);
        });
    }
    writeBlobAsObject(correlationId, data, timeToLive, callback) {
        let jsonData = JSON.stringify(data);
        let buffer = Buffer.from(jsonData, 'utf-8');
        let blobId = pip_services3_commons_node_3.IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: buffer.length,
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        };
        this.compressAndCreateBlob(correlationId, blob, buffer, callback);
    }
    readBlobAsObject(correlationId, blobId, callback) {
        this.readAndDecompressBlob(correlationId, blobId, (err, buffer) => {
            if (err != null || buffer == null) {
                callback(err, null);
            }
            let jsonData = buffer.toString('utf-8');
            let data = JSON.parse(jsonData);
            callback(null, data);
        });
    }
    writeBlobConditional(correlationId, data, timeToLive, callback) {
        if (data == null) {
            callback(null, null);
            return;
        }
        let jsonData = JSON.stringify(data);
        let buffer = Buffer.from(jsonData, 'utf-8');
        if (buffer.length < this._maxObjectSize) {
            let envelop = {
                data: data,
                blob_id: null
            };
            callback(null, envelop);
            return;
        }
        let blobId = pip_services3_commons_node_3.IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: buffer.length,
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        };
        this.compressAndCreateBlob(correlationId, blob, buffer, (err, blobId) => {
            if (err != null || blobId == null) {
                callback(err, null);
                return;
            }
            let envelop = {
                data: null,
                blob_id: blobId
            };
            callback(null, envelop);
        });
    }
    readBlobConditional(correlationId, envelop, callback) {
        if (envelop.data != null) {
            callback(null, envelop.data);
            return;
        }
        this.readAndDecompressBlob(correlationId, envelop.blob_id, (err, buffer) => {
            if (err != null || buffer == null) {
                callback(err, null);
                return;
            }
            let jsonData = buffer.toString('utf-8');
            let data = JSON.parse(jsonData);
            callback(err, data);
        });
    }
    writeBlobToStream(correlationId, timeToLive, callback) {
        let blobId = pip_services3_commons_node_3.IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: null,
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        };
        return this._client.createBlobFromStream(correlationId, blob, (err, blob) => {
            if (callback)
                callback(err, blob != null ? blob.id : null);
        });
    }
    readBlobFromStream(correlationId, blobId, callback) {
        return this._client.getBlobStreamById(correlationId, blobId, (err, blob, stream) => {
            callback(err, blob != null ? blob.id : null, stream);
        });
    }
    extendBlob(correlationId, blobId, timeToLive, callback) {
        this._client.getBlobById(correlationId, blobId, (err, blob) => {
            if (err != null || blob == null) {
                if (callback)
                    callback(err);
                return;
            }
            let now = new Date().getTime();
            blob.expire_time = new Date(now + timeToLive * 1000);
            this._client.updateBlobInfo(correlationId, blob, (err, blob) => {
                if (callback)
                    callback(err);
            });
        });
    }
    deleteBlobById(correlationId, blobId, callback) {
        this._client.deleteBlobById(correlationId, blobId, callback);
    }
    deleteBlobsByIds(correlationId, blobIds, callback) {
        this._client.deleteBlobsByIds(correlationId, blobIds, callback);
    }
}
exports.AbstractTempBlobsClientV1 = AbstractTempBlobsClientV1;
//# sourceMappingURL=AbstractTempBlobsClientV1.js.map