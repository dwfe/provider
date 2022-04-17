import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../provider'

export function inject(provide: any) {
  return (target: object, propKey: string | symbol, paramIndex: number) => {
    const metadata: IProviderMetadata = {
      ...(Reflect.getMetadata(PROVIDER_METADATA_KEY, target, propKey) || {})
    };
    metadata.ctorParams ??= {};
    metadata.ctorParams[paramIndex] = provide;
    Reflect.defineMetadata(PROVIDER_METADATA_KEY, metadata, target, propKey);
  }
}
