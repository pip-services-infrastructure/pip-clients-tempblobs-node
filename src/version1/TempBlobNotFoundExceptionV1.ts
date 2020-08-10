import { NotFoundException } from 'pip-services3-commons-node';

export class TempBlobNotFoundExceptionV1 extends NotFoundException {
    public constructor(correlationId: string, blobId: string, message: string) {
        super(correlationId, 'TEMP_BLOB_NOT_FOUND', message ?? 'Temp blob with id ' + blobId + ' was not found');
    }
}