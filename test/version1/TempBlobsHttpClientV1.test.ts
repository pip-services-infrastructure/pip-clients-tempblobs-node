let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { BlobsMemoryPersistence } from 'pip-services-blobs-node';
import { BlobsController } from 'pip-services-blobs-node';
import { BlobsHttpServiceV1 } from 'pip-services-blobs-node';
import { ITempBlobsClientV1 } from '../../src/version1/ITempBlobsClientV1';
import { TempBlobsHttpClientV1 } from '../../src/version1/TempBlobsHttpClientV1';
import { TempBlobsClientFixtureV1 } from './TempBlobsClientFixtureV1';

var httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('TempBlobsHttpClientV1', () => {
    let service: BlobsHttpServiceV1;
    let client: TempBlobsHttpClientV1;
    let fixture: TempBlobsClientFixtureV1;

    suiteSetup((done) => {
        let logger = new ConsoleLogger();
        let persistence = new BlobsMemoryPersistence();
        let controller = new BlobsController();

        service = new BlobsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-blobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-blobs', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-blobs', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        client = new TempBlobsHttpClientV1();
        client.setReferences(references);
        client.configure(httpConfig);

        fixture = new TempBlobsClientFixtureV1(client);

        service.open(null, (err) => {
            client.open(null, done);
        });
    });

    suiteTeardown((done) => {
        fixture.clear(() => {
            client.close(null, null);
            service.close(null, done);
        });
    });

    teardown((done) => {
        fixture.clear(done);
    });

    test('Get blob infos', (done) => {
        fixture.testGetBlobInfos(done);
    });

    test('Search', (done) => {
        fixture.testSearch(done);
    });

    test('Read / write blobs', (done) => {
        fixture.testReadWriteBlobs(done);
    });

    test('Read / write blob streams', (done) => {
        fixture.testReadWriteBlobStreams(done);
    });

    test('Blob expiration', (done) => {
        fixture.testBlobExpiration(done);
    });

    test('Conditional read / write', (done) => {
        fixture.testConditionalReadWrite(done);
    });
});
