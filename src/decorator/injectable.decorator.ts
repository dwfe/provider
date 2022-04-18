import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function injectable(metadata: IProviderMetadata = {}) {
  return (target: object) => {
    metadata = {
      ...(Reflect.getMetadata(PROVIDER_METADATA_KEY, target) || {}),
      ...metadata,
    };
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
  };
}
