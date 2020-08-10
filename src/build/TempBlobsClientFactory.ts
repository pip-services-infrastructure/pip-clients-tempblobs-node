import { Descriptor } from 'pip-services3-commons-node';
import { Factory } from 'pip-services3-components-node';

import { TempBlobsNullClientV1 } from '../version1/TempBlobsNullClientV1';
import { TempBlobsDirectClientV1 } from '../version1/TempBlobsDirectClientV1';
import { TempBlobsHttpClientV1 } from '../version1/TempBlobsHttpClientV1';
import { TempBlobsLambdaClientV1 } from '../version1/TempBlobsLambdaClientV1';
import { TempBlobsS3ClientV1 } from '../version1/TempBlobsS3ClientV1';
import { TempBlobsCommandableGrpcClientV1 } from '../version1/TempBlobsCommandableGrpcClientV1';
import { TempBlobsGrpcClientV1 } from '../version1/TempBlobsGrpcClientV1';

export class TempBlobsClientFactory extends Factory {
	public static Descriptor: Descriptor = new Descriptor('pip-services-tempblobs', 'factory', 'default', 'default', '1.0');
	public static NullClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'null', 'default', '1.0');
	public static DirectClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'direct', 'default', '1.0');
	public static HttpClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'http', 'default', '1.0');
	public static LambdaClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'lambda', 'default', '1.0');
	public static S3ClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 's3', 'default', '1.0');
	public static CommandableGrpcClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'commandable-grpc', 'default', '1.0');
	public static GrpcClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'grpc', 'default', '1.0');
	
	constructor() {
		super();

		this.registerAsType(TempBlobsClientFactory.NullClientV1Descriptor, TempBlobsNullClientV1);
		this.registerAsType(TempBlobsClientFactory.DirectClientV1Descriptor, TempBlobsDirectClientV1);
		this.registerAsType(TempBlobsClientFactory.HttpClientV1Descriptor, TempBlobsHttpClientV1);
		this.registerAsType(TempBlobsClientFactory.LambdaClientV1Descriptor, TempBlobsLambdaClientV1);
		this.registerAsType(TempBlobsClientFactory.S3ClientV1Descriptor, TempBlobsS3ClientV1);
		this.registerAsType(TempBlobsClientFactory.CommandableGrpcClientV1Descriptor, TempBlobsCommandableGrpcClientV1);
		this.registerAsType(TempBlobsClientFactory.GrpcClientV1Descriptor, TempBlobsGrpcClientV1);
	}
	
}
