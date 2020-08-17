const { Readable } = require('stream');
let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
// let fs = require('fs');

import { IdGenerator, PagingParams, FilterParams, RandomString } from 'pip-services3-commons-node';

import { TempBlobInfoV1 } from '../../src/version1/TempBlobInfoV1';
import { ITempBlobsClientV1 } from '../../src/version1/ITempBlobsClientV1';
import { DataEnvelopV1 } from '../../src';

export class TempBlobsClientFixtureV1 {
    private _client: ITempBlobsClientV1;

    constructor(client: ITempBlobsClientV1) {
        this._client = client;
    }

    public createBlobs(callback: (err, ids: {
        blobId1?: string,
        blobId2?: string,
        blobId3?: string,
        blobId4?: string
    }) => void) {

        var ids: {
            blobId1?: string,
            blobId2?: string,
            blobId3?: string,
            blobId4?: string
        } = {};

        async.series([
            (callback) => {
                this._client.writeBlobAsObject(null, "AAAA", 60, (err, blobId) => {
                    assert.isNull(err);
                    ids.blobId1 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobAsObject(null, "BBBB", 60, (err, blobId) => {
                    assert.isNull(err);
                    ids.blobId2 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobAsObject(null, "CCCC", 60, (err, blobId) => {
                    assert.isNull(err);
                    ids.blobId3 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobAsObject(null, "DDDD", 60, (err, blobId) => {
                    assert.isNull(err);
                    ids.blobId4 = blobId;
                    callback();
                });
            }], (err) => {
                callback(err, ids);
            });
    }

    public clear(done) {
        async.series([
            (callback) => this._client.getBlobInfosByFilter(null, null, null, (err, page) => {
                assert.isNull(err);
                assert.isNotNull(page);

                let ids = page.data.map(x => x.id);

                this._client.deleteBlobsByIds(null, ids, (err) => {
                    assert.isNull(err);
                    callback();
                });
            })
        ], done);
    }

    public testGetBlobInfos(done) {
        var ids: {
            blobId1?: string,
            blobId2?: string,
            blobId3?: string,
            blobId4?: string
        } = {};

        async.series([
            (callback) => this.createBlobs((err, blobIds) => {
                assert.isNull(err);
                ids = blobIds;
                callback();
            }),
            (callback) => {
                this._client.getBlobUriById(null, ids.blobId1, (err, uri) => {
                    assert.isNull(err);
                    // get uri is not supported by pip-services-blobs-node
                    // assert.isNotNull(uri);
                    callback();
                });
            },
            (callback) => {
                this._client.getBlobInfosByFilter(null, null, new PagingParams(1, 10, false), (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.isTrue(page.data.length >= 3);
                    callback();
                });
            },
            (callback) => {
                this._client.getBlobInfosByFilter(null, FilterParams.fromTuples("id", ids.blobId2), null, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.equal(1, page.data.length);
                    callback();
                });
            },
            //  not supported by pip-services-blobs-node
            // (callback) => {
            //     this._client.getBlobInfosByFilter(null, FilterParams.fromTuples("ids", blobId1 + "," + blobId3), null, (err, page) => {
            //         assert.isNull(err);
            //         assert.isNotNull(page);
            //         assert.equal(2, page.data.length);
            //         callback();
            //     });
            // },
            (callback) => {
                this._client.getBlobInfosByFilter(null, FilterParams.fromTuples("search", ids.blobId2), null, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.equal(1, page.data.length);
                    callback();
                });
            },

        ], done);
    }

    public testSearch(done) {
        var ids: {
            blobId1?: string,
            blobId2?: string,
            blobId3?: string,
            blobId4?: string
        } = {};

        async.series([
            (callback) => this.createBlobs((err, blobIds) => {
                assert.isNull(err);
                ids = blobIds;
                callback();
            }),
            (callback) => {
                this._client.getBlobInfosByFilter(null, FilterParams.fromTuples("search", '.dat'), null, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.equal(4, page.data.length);
                    callback();
                });
            },
        ], done);
    }

    public testReadWriteBlobs(done) {
        var blobId1: string;
        var blobId2: string;

        var original1 = "123";
        var original2 = "ABC";

        async.series([
            (callback) => {
                this._client.writeBlobAsObject(null, original1, 60, (err, blobId) => {
                    assert.isNull(err);
                    blobId1 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobAsObject(null, original2, 60, (err, blobId) => {
                    assert.isNull(err);
                    blobId2 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.readBlobAsObject<string>(null, blobId1, (err, data1) => {
                    assert.isNull(err);
                    assert.equal(original1, data1);
                    callback();
                });
            },
            (callback) => {
                this._client.readBlobAsObject<string>(null, blobId2, (err, data2) => {
                    assert.isNull(err);
                    assert.equal(original2, data2);
                    callback();
                });
            },
            (callback) => {
                this._client.deleteBlobById(null, blobId1, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                this._client.deleteBlobById(null, blobId2, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
            (callback) => {
                this._client.getBlobInfosByFilter(null, null, null, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.equal(0, page.data.length);
                    callback();
                });
            },
        ], done);
    }

    public testReadWriteBlobStreams(done) {
        var blobId1: string;
        var original = '123';

        async.series([
            (callback) => {
                let rs = Readable.from(original);

                let ws = this._client.writeBlobToStream(null, 600, (err, blobId) => {
                    assert.isNull(err);
                    blobId1 = blobId;
                    callback();
                });

                assert.isNotNull(ws);
                rs.pipe(ws);
            },
            // Get blob info
            (callback) => {
                this._client.getBlobInfoById(
                    null, blobId1, (err, blob) => {
                        assert.isNull(err);

                        assert.isObject(blob);
                        assert.equal(3, blob.size);

                        callback();
                    }
                )
            },
            (callback) => {
                let outData;

                let rs = this._client.readBlobFromStream(null, blobId1, (err, blobId, stream) => {
                    assert.isNull(err);
                    assert.equal(blobId1, blobId);
                    assert.equal(original.length, outData.length);
                    callback();
                });

                const chunks = [];

                rs.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = rs.read())) {
                        chunks.push(chunk);
                    }
                });

                rs.on('end', () => {
                    outData = chunks.join('');
                });
            },
            (callback) => {
                this._client.deleteBlobById(null, blobId1, (err) => {
                    assert.isNull(err);
                    callback();
                });
            },
        ], done);
    }

    public testBlobExpiration(done) {
        var blobId1: string;
        var blobId2: string;

        var original1 = "123";
        var original2 = "ABC";

        async.series([
            (callback) => {
                this._client.writeBlobAsObject(null, original1, 0, (err, blobId) => {
                    assert.isNull(err);
                    blobId1 = blobId;
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobAsObject(null, original2, 0, (err, blobId) => {
                    assert.isNull(err);
                    blobId2 = blobId;
                    callback();
                });
            },
            // (callback) => {
            //     setTimeout(() => {
            //         callback();
            //     }, 100);
            // },
            // deleteExpired method not implemented?
            // (callback) => {
            //     this._client.deleteExpired(null, blobId1, (err) => {
            //         assert.isNull(err);
            //         callback();
            //     });
            // },
            (callback) => {
                this._client.getBlobInfosByFilter(null, FilterParams.fromTuples('expired', false), null, (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page);
                    assert.equal(0, page.data.length);
                    callback();
                });
            },
        ], done);
    }

    public testConditionalReadWrite(done) {
        var envelop1: DataEnvelopV1<string>;
        var maxObjectSize: number = 30 * 1024;
        var compressionThreshold: number = 100 * 1024;

        var testData1 = RandomString.nextString(maxObjectSize + 1, maxObjectSize + 2);
        var testData2 = RandomString.nextString(compressionThreshold + 100, compressionThreshold + 200);

        async.series([
            (callback) => {
                this._client.writeBlobConditional(null, null, 60, (err, envelop) => {
                    assert.isNull(err);
                    assert.isNull(envelop);
                    callback();
                });
            },
            (callback) => {
                this._client.writeBlobConditional(null, '123', 60, (err, envelop) => {
                    assert.isNull(err);
                    assert.isNotNull(envelop);
                    assert.isNotNull(envelop.data);
                    assert.isNull(envelop.blob_id);
                    assert.equal("123", envelop.data);

                    envelop1 = envelop;
                    callback();
                });
            },
            (callback) => {
                this._client.readBlobConditional(null, envelop1, (err, data) => {
                    assert.isNull(err);
                    assert.equal("123", data);
                    callback();
                });
            },
            // should be written to blob
            (callback) => {
                this._client.writeBlobConditional(null, testData1, 60, (err, envelop) => {
                    assert.isNull(err);
                    assert.isNotNull(envelop);
                    assert.isNull(envelop.data);
                    assert.isNotNull(envelop.blob_id);

                    envelop1 = envelop;
                    callback();
                });
            },
            (callback) => {
                this._client.readBlobConditional(null, envelop1, (err, data) => {
                    assert.isNull(err);
                    assert.equal(testData1, data);
                    callback();
                });
            },
            //  should be written to blob and compressed
            (callback) => {
                this._client.writeBlobConditional(null, testData2, 60, (err, envelop) => {
                    assert.isNull(err);
                    assert.isNotNull(envelop);
                    assert.isNull(envelop.data);
                    assert.isNotNull(envelop.blob_id);

                    envelop1 = envelop;
                    callback();
                });
            },
            (callback) => {
                this._client.readBlobConditional(null, envelop1, (err, data) => {
                    assert.isNull(err);
                    assert.equal(testData2, data);
                    callback();
                });
            },
        ], done);
    }

}
