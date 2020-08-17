"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const TempBlobsNullClientV1_1 = require("../version1/TempBlobsNullClientV1");
const TempBlobsDirectClientV1_1 = require("../version1/TempBlobsDirectClientV1");
const TempBlobsHttpClientV1_1 = require("../version1/TempBlobsHttpClientV1");
class TempBlobsClientFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(TempBlobsClientFactory.NullClientV1Descriptor, TempBlobsNullClientV1_1.TempBlobsNullClientV1);
        this.registerAsType(TempBlobsClientFactory.DirectClientV1Descriptor, TempBlobsDirectClientV1_1.TempBlobsDirectClientV1);
        this.registerAsType(TempBlobsClientFactory.HttpClientV1Descriptor, TempBlobsHttpClientV1_1.TempBlobsHttpClientV1);
    }
}
exports.TempBlobsClientFactory = TempBlobsClientFactory;
TempBlobsClientFactory.Descriptor = new pip_services3_commons_node_1.Descriptor('pip-services-tempblobs', 'factory', 'default', 'default', '1.0');
TempBlobsClientFactory.NullClientV1Descriptor = new pip_services3_commons_node_1.Descriptor('pip-services-tempblobs', 'client', 'null', 'default', '1.0');
TempBlobsClientFactory.DirectClientV1Descriptor = new pip_services3_commons_node_1.Descriptor('pip-services-tempblobs', 'client', 'direct', 'default', '1.0');
TempBlobsClientFactory.HttpClientV1Descriptor = new pip_services3_commons_node_1.Descriptor('pip-services-tempblobs', 'client', 'http', 'default', '1.0');
//# sourceMappingURL=TempBlobsClientFactory.js.map