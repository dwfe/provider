import {TAnyObject} from '@do-while-for-each/common'

export interface IProviderMetadata {
  isOnlyOne?: boolean;
  ctorParams?: TAnyObject;
}

export interface IAllMetadata {
  hasDesignType: boolean;
  designType: any;         // "design:type", by TypeScript

  hasDesignParamtypes: boolean;
  designParamtypes: any[]; // "design:paramtypes", by TypeScript

  hasDesignReturntype: boolean;
  designReturntype: any;   // "design:returntype", by TypeScript

  hasProviderMetadata: boolean;
  providerMetadata: IProviderMetadata;
}
