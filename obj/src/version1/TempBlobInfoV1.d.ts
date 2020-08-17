import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class TempBlobInfoV1 implements IStringIdentifiable {
    id: string;
    size: number;
    create_time: Date;
    expire_time: Date;
}
