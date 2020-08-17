"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_clients_blobs_node_1 = require("pip-clients-blobs-node");
const AbstractTempBlobsClientV1_1 = require("./AbstractTempBlobsClientV1");
class TempBlobsHttpClientV1 extends AbstractTempBlobsClientV1_1.AbstractTempBlobsClientV1 {
    constructor(config) {
        super(new pip_clients_blobs_node_1.BlobsHttpClientV1());
    }
}
exports.TempBlobsHttpClientV1 = TempBlobsHttpClientV1;
//# sourceMappingURL=TempBlobsHttpClientV1.js.map