import { NotFoundException } from 'pip-services3-commons-node';
export declare class TempBlobNotFoundExceptionV1 extends NotFoundException {
    constructor(correlationId: string, blobId: string, message: string);
}
