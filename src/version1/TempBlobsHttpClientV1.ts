import { BlobsHttpClientV1 } from 'pip-clients-blobs-node';

import { AbstractTempBlobsClientV1 } from './AbstractTempBlobsClientV1';

export class TempBlobsHttpClientV1 extends AbstractTempBlobsClientV1 {            
    public constructor(config?: any) {
        super(new BlobsHttpClientV1());
    }
}