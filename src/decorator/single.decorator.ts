import {IProviderMetadata, PROVIDER_METADATA_KEY, ROOT_PROVIDER_ID} from '../provider'

export function single(providerId = ROOT_PROVIDER_ID) {
  return (target: object) => {
    const metadata: IProviderMetadata = {
      providerId,
      isOnlyOne: true
    };
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target);
  }
}
