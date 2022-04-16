export interface IProviderMetadata {
  isOnlyOne?: boolean;
}

export interface IAllMetadata {
  designType: any;
  designParamtypes: any[];
  designReturntype: any;
  providerMetadata: IProviderMetadata;
}
