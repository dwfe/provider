export interface IProviderGetOpt {

  deps?: any[]; // a second-level filter applied to the result of getting registry entries

  /**
   * E.g.
   *   {provide: User, deps: ['John']}
   * when
   *   {provide: 'John', ...}
   * is not registered in the registry.
   * As a result, the instance will be created like this:
   *   new User('John')
   */
  primitiveCanBeResult?: boolean;

}

export interface IProviderMetadata {
  isOnlyOne?: boolean;
}

export interface IAllMetadata {
  designParamtypes: any[];
  providerMetadata: IProviderMetadata;
}
