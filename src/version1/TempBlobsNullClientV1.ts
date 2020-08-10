import { IdGenerator } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { TempBlobInfoV1 } from './TempBlobInfoV1';
import { ITempBlobsClientV1 } from './ITempBlobsClientV1';
import { DataEnvelopV1 } from './DataEnvelopV1';

export class TempBlobsNullClientV1 implements ITempBlobsClientV1 {
    constructor(config?: any) {}
        
    public getBlobInfosByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<TempBlobInfoV1>) => void): void {
        callback(null, new DataPage<TempBlobInfoV1>());
    }

    public getBlobInfosByIds(correlationId: string, blobIds: string[],
        callback: (err: any, blobs: TempBlobInfoV1[]) => void): void {
        callback(null, []);
    }

    public getBlobInfoById(correlationId: string, blobId: string,
        callback: (err: any, blob: TempBlobInfoV1) => void): void {
        callback(null, null);
    }

    public getBlobUriById(correlationId: string, blobId: string,
        callback: (err: any, uri: string) => void): void {
        callback(null, null);
    }

    public writeBlobAsObject<T>(correlationId: string, data: T, timeToLive: number,
        callback?: (err: any, blobId: string) => void): void {
        if (callback) callback(null, IdGenerator.nextLong());
    }

    public readBlobAsObject<T>(correlationId: string, blobId: string,
        callback: (err: any, data: T) => void): void {
        callback(null, null);
    }

    public writeBlobConditional<T>(correlationId: string, data: T, timeToLive: number,
        callback?: (err: any, envelop: DataEnvelopV1<T>) => void): void {
        let envelop = <DataEnvelopV1<T>> {
            data: data
        };
        if (callback) callback(null, envelop);
    }

    public readBlobConditional<T>(correlationId: string, envelop: DataEnvelopV1<T>,
        callback: (err: any, data: T) => void): void {
        if (envelop.data != null) {
            callback(null, envelop.data);
        } else {
            callback(null, null);
        }
    }
    
    public writeBlobToStream(correlationId: string, timeToLive: number,
        callback?: (err: any, blobId: string) => void): any {
        if (callback) callback(null, IdGenerator.nextLong());
    }   

    public readBlobFromStream(correlationId: string, blobId: string,
        callback?: (err: any, blobId: string, stream: any) => void): any {
        callback(null, null, null);
    }

    public extendBlob(correlationId: string, blobId: string, timeToLive: number,
        callback?: (err: any) => void): void {
        if (callback) callback(null);
    }

    public deleteBlobById(correlationId: string, blobId: string,
        callback?: (err: any) => void): void {
        if (callback) callback(null);        
    }

    public deleteBlobsByIds(correlationId: string, blobIds: string[],
        callback?: (err: any) => void): void {
        if (callback) callback(null);
    }
}
