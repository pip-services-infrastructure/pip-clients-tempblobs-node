const _ = require('lodash');
const zlib = require('zlib');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { IBlobsClientV1 } from 'pip-clients-blobs-node';
import { BlobInfoV1 } from 'pip-clients-blobs-node';

import { ITempBlobsClientV1 } from './ITempBlobsClientV1';
import { TempBlobInfoV1 } from './TempBlobInfoV1';
import { DataEnvelopV1 } from './DataEnvelopV1';

export abstract class AbstractTempBlobsClientV1
    implements ITempBlobsClientV1, IConfigurable, IReferenceable {
    private _client: IBlobsClientV1;
    private _maxObjectSize: number = 30 * 1024;
    private _compressionThreshold: number = 100 * 1024;

    protected constructor(client: IBlobsClientV1) {
        this._client = client;
    }

    public configure(config: ConfigParams): void {
        this._maxObjectSize = config.getAsLongWithDefault('options.max_object_size', this._maxObjectSize);
        this._compressionThreshold = config.getAsLongWithDefault('options.compression_threshold', this._compressionThreshold);

        let client: any = this._client;
        if (_.isFunction(client.config))
            client.configure(config);
    }

    public setReferences(references: IReferences): void {
        let client: any = this._client;
        if (_.isFunction(client.setReferences))
            client.setReferences(references);
    }

    private toPublic(value: BlobInfoV1): TempBlobInfoV1 {
        return <TempBlobInfoV1> {
            id: value.id,
            size: value.size,
            create_time: value.create_time,
            expire_time: value.expire_time
        };
    }

    public getBlobInfosByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<TempBlobInfoV1>) => void): void {
        filter = filter || new FilterParams();
        filter.setAsObject('group', 'temp');
        this._client.getBlobsByFilter(correlationId, filter, paging, (err, page) => {
            if (err != null || page == null) {
                callback(err, null);
                return;
            }

            let data = _.map(page.data, x => this.toPublic(x));
            let result = new DataPage<TempBlobInfoV1>(data, page.total);
            callback(null, result);
        });
    }

    public getBlobInfosByIds(correlationId: string, blobIds: string[],
        callback: (err: any, blobs: TempBlobInfoV1[]) => void): void {
        this._client.getBlobsByIds(correlationId, blobIds, (err, blobs) => {
            if (err != null || blobs == null) {
                callback(err, null);
                return;
            }

            let result = _.map(blobs, x => this.toPublic(x));
            callback(null, result);
        });
    }

    public getBlobInfoById(correlationId: string, blobId: string,
        callback: (err: any, blob: TempBlobInfoV1) => void): void {
        this._client.getBlobById(correlationId, blobId, (err, blob) => {
            if (err != null || blob == null) {
                callback(err, null);
                return;
            }

            let result = this.toPublic(blob);
            callback(null, result);
        });
    }

    public getBlobUriById(correlationId: string, blobId: string,
        callback: (err: any, uri: string) => void): void {
        this._client.getBlobUriById(correlationId, blobId, callback);
    }

    private compressAndCreateBlob(correlationId: string, blob: BlobInfoV1, buffer: Buffer, 
        callback: (err: any, blobId: string) => void): void {
        if (buffer.length < this._compressionThreshold) {
            blob.name = blob.id + '.dat';
            blob.content_type = 'application/json';

            this._client.createBlobFromData(correlationId, blob, buffer, (err, blob) => {
                if (callback) callback(err, blob != null ? blob.id : null);
            });
            return;
        }

        zlib.gzip(buffer, (err, buffer) => {
            if (err) {
                if (callback) callback(err, null);
                return;
            }

            blob.name = blob.id + '.gzip';
            blob.content_type = 'application/x-gzip';

            this._client.createBlobFromData(correlationId, blob, buffer, (err, blob) => {
                if (callback) callback(err, blob != null ? blob.id : null);
            });
        });
    }

    private readAndDecompressBlob(correlationId: string, blobId: string, 
        callback: (err: any, buffer: Buffer) => void): void {
        this._client.getBlobDataById(correlationId, blobId, (err, blob, buffer) => {
            if (err != null || blob == null || buffer == null) {
                if (callback) callback(err, null);
                return;
            }

            if (!blob.name.endsWith('.gzip')) {
                if (callback) callback(null, buffer);
                return;
            }

            zlib.gunzip(buffer, callback);
        });
    }

    public writeBlobAsObject<T>(correlationId: string, data: T, timeToLive: number,
        callback?: (err: any, blobId: string) => void): void {
        let jsonData = JSON.stringify(data);
        let buffer = Buffer.from(jsonData, 'utf-8');
        let blobId = IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob: BlobInfoV1 = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: buffer.length,            
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        }

        this.compressAndCreateBlob(correlationId, blob, buffer, callback);
    }

    public readBlobAsObject<T>(correlationId: string, blobId: string,
        callback: (err: any, data: T) => void): void {
        this.readAndDecompressBlob(correlationId, blobId, (err, buffer) => {
            if (err != null || buffer == null) {
                callback(err, null);
            }

            let jsonData = buffer.toString('utf-8');
            let data = JSON.parse(jsonData);
            callback(null, data);
        });
    }

    public writeBlobConditional<T>(correlationId: string, data: T, timeToLive: number,
        callback?: (err: any, envelop: DataEnvelopV1<T>) => void): void {
        let jsonData = JSON.stringify(data);
        let buffer = Buffer.from(jsonData, 'utf-8');

        if (buffer.length < this._maxObjectSize) {
            let envelop = <DataEnvelopV1<T>> {
                data: data
            };
            callback(null, envelop);
            return;
        }

        let blobId = IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob: BlobInfoV1 = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: buffer.length,            
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        }

        this.compressAndCreateBlob(correlationId, blob, buffer, (err, blobId) => {
            if (err != null || blobId == null) {
                callback(err, null);
                return;
            }

            let envelop = <DataEnvelopV1<T>> {
                blob_id: blobId
            };
            callback(null, envelop);
        });            
    }

    public readBlobConditional<T>(correlationId: string, envelop: DataEnvelopV1<T>,
        callback: (err: any, data: T) => void): void {
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
    
    public writeBlobToStream(correlationId: string, timeToLive: number,
        callback?: (err: any, blobId: string) => void): any {
        let blobId = IdGenerator.nextLong();
        let now = new Date().getTime();
        let blob: BlobInfoV1 = {
            id: blobId,
            group: 'temp',
            name: blobId + '.dat',
            content_type: 'application/json',
            size: null,            
            create_time: new Date(),
            expire_time: new Date(now + timeToLive * 1000),
            completed: true
        }
        
        return this._client.createBlobFromStream(correlationId, blob, (err, blob) => {
            if (callback) callback(err, blob != null ? blob.id : null);
        });
    }

    public readBlobFromStream(correlationId: string, blobId: string,
        callback?: (err: any, blobId: string, stream: any) => void): any {
        return this._client.getBlobStreamById(correlationId, blobId, (err, blob, stream) => {
            callback(err, blob != null ? blob.id : null, stream);
        })
    }

    public extendBlob(correlationId: string, blobId: string, timeToLive: number,
        callback?: (err: any) => void): void {
        this._client.getBlobById(correlationId, blobId, (err, blob) => {
            if (err != null || blob == null) {
                if (callback) callback(err);
                return;
            }

            let now = new Date().getTime();
            blob.expire_time = new Date(now + timeToLive * 1000);
            this._client.updateBlobInfo(correlationId, blob, (err, blob) => {
                if (callback) callback(err);
            });
        });
    }

    public deleteBlobById(correlationId: string, blobId: string,
        callback?: (err: any) => void): void {
        this._client.deleteBlobById(correlationId, blobId, callback);
    }

    public deleteBlobsByIds(correlationId: string, blobIds: string[],
        callback?: (err: any) => void): void {
        this._client.deleteBlobsByIds(correlationId, blobIds, callback);
    }

} 