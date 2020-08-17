let assert = require('chai').assert;
let async = require('async');

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { BlobsMemoryPersistence } from 'pip-services-blobs-node';
import { BlobsController } from 'pip-services-blobs-node';
import { ITempBlobsClientV1 } from '../../src/version1/ITempBlobsClientV1';
import { TempBlobsDirectClientV1 } from '../../src/version1/TempBlobsDirectClientV1';
import { TempBlobsClientFixtureV1 } from './TempBlobsClientFixtureV1';

suite('TempBlobsDirectClientV1', () => {
    let client: TempBlobsDirectClientV1;
    let fixture: TempBlobsClientFixtureV1;

    suiteSetup((done) => {
        let logger = new ConsoleLogger();
        let persistence = new BlobsMemoryPersistence();
        let controller = new BlobsController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-blobs', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-blobs', 'controller', 'default', 'default', '1.0'), controller,
        );
        controller.setReferences(references);

        client = new TempBlobsDirectClientV1();
        client.configure(ConfigParams.fromTuples(
            'options.chunk_size', 1024
        ));
        client.setReferences(references);

        fixture = new TempBlobsClientFixtureV1(client);

        client.open(null, done);
    });

    suiteTeardown((done) => {
        fixture.clear((err) => {
            client.close(null, done);
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
