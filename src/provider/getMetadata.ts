import {IProviderMetadata, PROVIDER_METADATA_KEY} from './index'
import {IAllMetadata} from './contract'

export const getMetadata = (target: any): IAllMetadata => ({
  designType: Reflect.getMetadata('design:type', target),
  designParamtypes: Reflect.getMetadata('design:paramtypes', target) || [],
  designReturntype: Reflect.getMetadata('design:returntype', target),
  providerMetadata: Reflect.getMetadata(PROVIDER_METADATA_KEY, target),
});

export function getCtorParamsMetadata(ctor: any): IProviderMetadata['ctorParams'] | undefined {
  const {providerMetadata} = getMetadata(ctor);
  return (providerMetadata || {}).ctorParams;
}
