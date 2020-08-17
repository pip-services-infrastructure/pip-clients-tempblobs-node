import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { TempBlobInfoV1 } from './TempBlobInfoV1';
import { DataEnvelopV1 } from './DataEnvelopV1';
export interface ITempBlobsClientV1 {
    getBlobInfosByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<TempBlobInfoV1>) => void): void;
    getBlobInfosByIds(correlationId: string, blobIds: string[], callback: (err: any, blobs: TempBlobInfoV1[]) => void): void;
    getBlobInfoById(correlationId: string, blobId: string, callback: (err: any, blob: TempBlobInfoV1) => void): void;
    getBlobUriById(correlationId: string, blobId: string, callback: (err: any, uri: string) => void): void;
    writeBlobAsObject<T>(correlationId: string, data: T, timeToLive: number, callback?: (err: any, blobId: string) => void): void;
    readBlobAsObject<T>(correlationId: string, blobId: string, callback: (err: any, data: T) => void): void;
    writeBlobConditional<T>(correlationId: string, data: T, timeToLive: number, callback?: (err: any, envelop: DataEnvelopV1<T>) => void): void;
    readBlobConditional<T>(correlationId: string, envelop: DataEnvelopV1<T>, callback: (err: any, data: T) => void): void;
    writeBlobToStream(correlationId: string, timeToLive: number, callback?: (err: any, blobId: string) => void): any;
    readBlobFromStream(correlationId: string, blobId: string, callback?: (err: any, blobId: string, stream: any) => void): any;
    extendBlob(correlationId: string, blobId: string, timeToLive: number, callback?: (err: any) => void): void;
    deleteBlobById(correlationId: string, blobId: string, callback?: (err: any) => void): void;
    deleteBlobsByIds(correlationId: string, blobIds: string[], callback?: (err: any) => void): void;
}
