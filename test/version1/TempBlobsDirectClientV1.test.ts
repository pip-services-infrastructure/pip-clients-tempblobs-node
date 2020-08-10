// let assert = require('chai').assert;
// let async = require('async');

// import { Descriptor } from 'pip-services3-commons-node';
// import { ConfigParams } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';
// import { ConsoleLogger } from 'pip-services3-components-node';

// import { BlobsMemoryPersistence } from 'pip-services-blobs-node';
// import { BlobsController } from 'pip-services-blobs-node';
// import { ITempBlobsClientV1 } from '../../src/version1/ITempBlobsClientV1';
// import { TempBlobsDirectClientV1 } from '../../src/version1/TempBlobsDirectClientV1';
// import { TempBlobsClientFixtureV1 } from './TempBlobsClientFixtureV1';

// suite('TempBlobsDirectClientV1', ()=> {
//     let client: TempBlobsDirectClientV1;
//     let fixture: TempBlobsClientFixtureV1;

//     suiteSetup((done) => {
//         let logger = new ConsoleLogger();
//         let persistence = new BlobsMemoryPersistence();
//         let controller = new BlobsController();

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
//             new Descriptor('pip-services-blobs', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('pip-services-blobs', 'controller', 'default', 'default', '1.0'), controller,
//         );
//         controller.setReferences(references);

//         client = new TempBlobsDirectClientV1();
//         // client.configure(ConfigParams.fromTuples(
//         //     'options.chunk_size', 3
//         // ));
//         client.setReferences(references);

//         fixture = new TempBlobsClientFixtureV1(client);

//         client.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         client.close(null, done);
//     });

//     test('Read / write chunks', (done) => {
//         fixture.testReadWriteChunks(done);
//     });

//     test('Read / write data', (done) => {
//         fixture.testReadWriteData(done);
//     });

//     test('Read / write stream', (done) => {
//         fixture.testReadWriteStream(done);
//     });

//     test('Get Uri for missing blob', (done) => {
//         fixture.testGetUriForMissingBlob(done);
//     });

// });
