import {PROVIDER_METADATA_KEY} from './index'
import {IAllMetadata} from './contract'

export const getMetadata = (target: any): IAllMetadata => ({
  designParamtypes: Reflect.getMetadata('design:paramtypes', target) || [], // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
  providerMetadata: Reflect.getMetadata(PROVIDER_METADATA_KEY, target),
});
