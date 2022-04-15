export interface IProviderGetOpt {
  deps?: any[]; // a second-level filter applied to the result of getting registry entries
  primitiveCanBeResult?: boolean; // e.g. {provide: User, deps: ['John']}
}
