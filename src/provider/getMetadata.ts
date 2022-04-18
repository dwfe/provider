import {PROVIDER_METADATA_KEY} from './index'
import {IAllMetadata} from './contract'

export const getMetadata = (target: any): IAllMetadata => {

  const hasDesignType = Reflect.hasMetadata('design:type', target);
  const designType = Reflect.getMetadata('design:type', target);

  const hasDesignParamtypes = Reflect.hasMetadata('design:paramtypes', target);
  const designParamtypes = Reflect.getMetadata('design:paramtypes', target) || [];

  const hasDesignReturntype = Reflect.hasMetadata('design:returntype', target);
  const designReturntype = Reflect.getMetadata('design:returntype', target);

  const hasProviderMetadata = Reflect.hasMetadata(PROVIDER_METADATA_KEY, target);
  const providerMetadata = Reflect.getMetadata(PROVIDER_METADATA_KEY, target) || {}

  return {
    hasDesignType,
    designType,

    hasDesignParamtypes,
    designParamtypes,

    hasDesignReturntype,
    designReturntype,

    hasProviderMetadata,
    providerMetadata,
  }
};
