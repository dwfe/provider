import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function injectable(metadata: IProviderMetadata = {}) {
  return (target: object) => {
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
  };
}
