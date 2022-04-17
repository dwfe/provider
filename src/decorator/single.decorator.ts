import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function single(target: object) {
  const metadata: IProviderMetadata = {
    ...(Reflect.getMetadata(PROVIDER_METADATA_KEY, target) || {}),
    isOnlyOne: true,
  };
  Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
}
