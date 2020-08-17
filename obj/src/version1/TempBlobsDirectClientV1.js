"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_clients_blobs_node_1 = require("pip-clients-blobs-node");
const AbstractTempBlobsClientV1_1 = require("./AbstractTempBlobsClientV1");
class TempBlobsDirectClientV1 extends AbstractTempBlobsClientV1_1.AbstractTempBlobsClientV1 {
    constructor(config) {
        super(new pip_clients_blobs_node_1.BlobsDirectClientV1());
    }
}
exports.TempBlobsDirectClientV1 = TempBlobsDirectClientV1;
//# sourceMappingURL=TempBlobsDirectClientV1.js.map