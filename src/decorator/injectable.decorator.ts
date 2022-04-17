import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function injectable(metadata: IProviderMetadata = {}) {
  return (target: object) => {
    const existedMetadata = Reflect.getMetadata(PROVIDER_METADATA_KEY, target);
    if (existedMetadata)
      metadata = {
        ...existedMetadata,
        ...metadata,
      };
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
  };
}
