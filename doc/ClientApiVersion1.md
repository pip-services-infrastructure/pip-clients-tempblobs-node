# Client API (version 1) <br/> TempBlobs Microservices Client SDK for Node.js

Node.js client API for TempBlobs microservice is a thin layer on the top of
communication protocols. It hides details related to specific protocol implementation
and provides high-level API to access the microservice for simple and productive development.

* [ITempBlobsClientV1 interface](#interface)
    - [getBlobInfosByFilter()](#operation1)
    - [getBlobInfosByIds()](#operation2)
    - [getBlobInfoById()](#operation3)
    - [getBlobUriById()](#operation4)
    - [writeBlobAsObject()](#operation5)
    - [readBlobAsObject()](#operation6)
    - [writeBlobConditional()](#operation7)
    - [readBlobConditional()](#operation8)
    - [writeBlobToStream()](#operation9)
    - [readBlobFromStream()](#operation10)
    - [extendBlob()](#operation11)
    - [deleteBlobById()](#operation12)
    - [deleteBlobsByIds()](#operation13)
* [TempBlobsHttpClientV1 class](#client_http)
* [TempBlobsDirectClientV1 class](#client_direct)
* [TempBlobsNullClientV1 class](#client_null)

## <a name="interface"></a> ITempBlobsClientV1 interface

If you are using Typescript, you can use ITempBlobsClientV1 as a common interface across all client implementations. 
If you are using plain typescript, you shall not worry about ITempBlobsClientV1 interface. You can just expect that
all methods defined in this interface are implemented by all client classes.

```typescript
interface ITempBlobsClientV1 {
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
```

### <a name="operation1"></a> getBlobInfosByFilter(correlationId, filter, paging, callback)

Get temp blobs by filter

**Arguments:** 
- correlationId: string - id that uniquely identifies transaction
- filter: Object
  - search: string - (optional) pattern string for search blobs by name or group
  - id: string - (optional) unique blob id
  - name: string - (optional) blob name
  - group: string - (optional) blob group
  - completed: boolean - (optional) blob completed
  - expired: boolean - (optional) true for retrieve expired blobs
  - fromCreateTime: Date - (optional) create blob timestamp from interval
  - toCreateTime: Date - (optional) create blob timestamp to interval
- paging: Object
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Returns:**
- err: Error - occured error or null for success
- page: DataPage<TempBlobInfoV1> - page with retrieved TempBlobInfoV1 value sets

### <a name="operation2"></a> getBlobInfosByIds(correlationId, blobIds, callback)

Retrieves information about stored blobs by its unique ids.

**Arguments:** 
- correlationId: string - id that uniquely identifies transaction
- blobIds: string[] - array of unique blobs ids

**Returns:**
- err: Error - occured error or null for success
- blobs: TempBlobInfoV1[] - retrieved created or exist job

### <a name="operation3"></a> getBlobInfoById(correlationId: string, blobId: string, callback: (err: any, blob: TempBlobInfoV1) => void): void;

Retrieves information about stored blob by its unique id.

**Arguments:** 
- correlationId: string - id that uniquely identifies transaction
- blobId: string - unique blob id

**Returns:**
- err: Error - occured error or null for success
- blob: TempBlobInfoV1 - blob information

### <a name="operation4"></a> getBlobUriById(correlationId, blobId, callback)

Retrieves url for direct access to the blob content.
Direct content url is only supported for AWS S3 data access.
Other implementations will return an error.

**Arguments:** 
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobId: string - unique blob id

**Returns:**
- err: Error - occured error or null for success
- uri: string - URL for direct access to the blob

### <a name="operation5"></a> writeBlobAsObject<T>(correlationId, data, timeToLive, callback)

Saves an object to a blob

**Arguments:** 
- correlationId: string - (optional) unique id that identifies distributed transaction
- data: T - the object to be saved to the blob
- timeToLive: number - blob lifetime in seconds

**Returns:**
- err: Error - occured error or null for success
- blobId: string - unique blob id

### <a name="operation6"></a> readBlobAsObject<T>(correlationId, blobId, callback)

Returns an object stored in a blob

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobId: string - blob id

**Returns:**
- err: Error - occured error or null for success
- data: T - retrieved object

### <a name="operation7"></a> writeBlobConditional<T>(correlationId, data, timeToLive, callback)

Saves data to a blob and returns an envelope

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- data: T - data to be saved
- timeToLive: number - blob lifetime in seconds

**Returns:**
- err: Error - occured error or null for success
- envelop: DataEnvelopV1<T> - data envelope

### <a name="operation8"></a> readBlobConditional<T>(correlationId, envelop, callback)

Returns data stored in a blob by envelope

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- envelop: DataEnvelopV1<T> - data envelope

**Returns:**
- err: Error - occured error or null for success
- data: T - retrieved blob data

### <a name="operation9"></a> writeBlobToStream(correlationId, timeToLive, callback)

Saving a blob to a stream

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- timeToLive: number - blob lifetime in seconds

**Returns:**
- err: Error - occured error or null for success
- blobId: string - unique identifier of the generated blob
- the method returns a stream to store the data of the blob

### <a name="operation10"></a> readBlobFromStream(correlationId, blobId, callback)

Reading blob content using a stream

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobId: string - blob id

**Returns:**
- err: Error - occured error or null for success
- blobId: string - blob id
- stream: any - stream to receive blob data

### <a name="operation11"></a> extendBlob(correlationId, blobId, timeToLive, callback)

Increases the lifetime of the blob 

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobId: string - blob id
- timeToLive - time in seconds by which the blob's lifetime will be increased

**Returns:**
- err: Error - occured error or null for success

### <a name="operation12"></a> deleteBlobById(correlationId, blobId, callback)

Delete blob by id

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobId: string - blob id for delete

**Returns:**
- err: Error - occured error or null for success

### <a name="operation13"></a> deleteBlobsByIds(correlationId, blobIds, callback)

Delete all blobs by list ids

**Arguments:**
- correlationId: string - (optional) unique id that identifies distributed transaction
- blobIds: string[] - list of blobs ids

**Returns:**
- err: Error - occured error or null for success


## <a name="client_http"></a> TempBlobsHttpClientV1 class

TempBlobsHttpClientV1 is a client that implements HTTP protocol

```typescript
class TempBlobsHttpClientV1 extends CommandableHttpClient implements ITempBlobsClientV1 {
    constructor(config?: any);
    setReferences(references);
    open(correlationId, callback);
    close(correlationId, callback);
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
```

**Constructor config properties:** 
- connection: object - HTTP transport configuration options
  - protocol: string - HTTP protocol - 'http' or 'https' (default is 'http')
  - host: string - IP address/hostname binding (default is '0.0.0.0')
  - port: number - HTTP port number

## <a name="client_direct"></a> TempBlobsDirectClientV1 class

TempBlobsDirectClientV1 is a dummy client calls controller from the same container. 
It can be used in monolytic deployments.

```typescript
class TempBlobsDirectClientV1 extends DirectClient<any> implements ITempBlobsClientV1 {
    constructor();
    setReferences(references);
    open(correlationId, callback);
    close(correlationId, callback);
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
```

## <a name="client_null"></a> TempBlobsNullClientV1 class

TempBlobsNullClientV1 is a dummy client that mimics the real client but doesn't call a microservice. 
It can be useful in testing scenarios to cut dependencies on external microservices.

```typescript
class TempBlobsNullClientV1 implements ITempBlobsClientV1 {
    constructor();
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
```