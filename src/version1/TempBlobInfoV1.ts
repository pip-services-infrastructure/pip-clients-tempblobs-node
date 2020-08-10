import { IStringIdentifiable } from 'pip-services3-commons-node';

export class TempBlobInfoV1 implements IStringIdentifiable {
    public id: string;
    public size: number;
    public create_time: Date;
    public expire_time: Date;
}