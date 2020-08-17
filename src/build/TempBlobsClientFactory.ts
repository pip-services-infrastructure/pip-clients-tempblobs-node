import { Descriptor } from 'pip-services3-commons-node';
import { Factory } from 'pip-services3-components-node';

import { TempBlobsNullClientV1 } from '../version1/TempBlobsNullClientV1';
import { TempBlobsDirectClientV1 } from '../version1/TempBlobsDirectClientV1';
import { TempBlobsHttpClientV1 } from '../version1/TempBlobsHttpClientV1';

export class TempBlobsClientFactory extends Factory {
	public static Descriptor: Descriptor = new Descriptor('pip-services-tempblobs', 'factory', 'default', 'default', '1.0');
	public static NullClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'null', 'default', '1.0');
	public static DirectClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'direct', 'default', '1.0');
	public static HttpClientV1Descriptor = new Descriptor('pip-services-tempblobs', 'client', 'http', 'default', '1.0');
	
	constructor() {
		super();

		this.registerAsType(TempBlobsClientFactory.NullClientV1Descriptor, TempBlobsNullClientV1);
		this.registerAsType(TempBlobsClientFactory.DirectClientV1Descriptor, TempBlobsDirectClientV1);
		this.registerAsType(TempBlobsClientFactory.HttpClientV1Descriptor, TempBlobsHttpClientV1);
	}
}
