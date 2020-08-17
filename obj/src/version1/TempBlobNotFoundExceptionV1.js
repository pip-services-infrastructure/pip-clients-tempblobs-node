"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class TempBlobNotFoundExceptionV1 extends pip_services3_commons_node_1.NotFoundException {
    constructor(correlationId, blobId, message) {
        super(correlationId, 'TEMP_BLOB_NOT_FOUND', (message !== null && message !== void 0 ? message : 'Temp blob with id ' + blobId + ' was not found'));
    }
}
exports.TempBlobNotFoundExceptionV1 = TempBlobNotFoundExceptionV1;
//# sourceMappingURL=TempBlobNotFoundExceptionV1.js.map