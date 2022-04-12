export interface IIdentity {
  base: any;
  deps?: any[];
}

export interface IEntity extends IIdentity {
  value: any;
}
