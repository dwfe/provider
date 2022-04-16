import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function single(target: object) {
  const metadata: IProviderMetadata = {
    isOnlyOne: true,
  };
  Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
}
