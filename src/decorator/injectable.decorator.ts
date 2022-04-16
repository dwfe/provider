import {IProviderMetadata, PROVIDER_METADATA_KEY, ROOT_PROVIDER_ID} from '../provider'

export function injectable(metadata: IProviderMetadata = {providerId: ROOT_PROVIDER_ID}) {
  return (target: object) => {
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
  };
}
