import {TAnyObject} from '@do-while-for-each/common'

export interface IProviderMetadata {
  isOnlyOne?: boolean;
  ctorParams?: TAnyObject;
}

export interface IAllMetadata {
  designType: any;
  designParamtypes: any[];
  designReturntype: any;
  providerMetadata: IProviderMetadata;
}
