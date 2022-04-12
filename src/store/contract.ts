export interface IEntity<TBase = any> {
  base: TBase;
  deps?: any[];
  value: any;
}
