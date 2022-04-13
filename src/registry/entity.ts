import {arraysEqualStrictCheck} from '../util'
import {IEntity} from './contract';

export class Entity implements IEntity {
  readonly provide: any;
  readonly deps: any[];
  readonly useValue: any;
  readonly multi: boolean;

  constructor(entity: IEntity) {
    const {provide, deps, useValue} = entity;
    if (!provide) {
      console.error(`Prop "provide" must be set:`, entity);
      throw new Error('Incorrect provide');
    }
    this.provide = provide;
    if (!!deps && !Array.isArray(deps)) {
      console.error(`Prop "deps" if set, then it must be an array:`, entity);
      throw new Error('Incorrect deps');
    }
    this.deps = deps || [];
    if (useValue === undefined) {
      console.error(`Prop "useValue" must be set:`, entity);
      throw new Error('Incorrect useValue');
    }
    this.useValue = useValue;
    this.multi = !!multi || false;
  }

  equals({provide, deps}: Entity): boolean {
    if (this.provide !== provide)
      return false;
    return arraysEqualStrictCheck(this.deps, deps);
  }

  get orig(): IEntity {
    const {provide, deps, useValue, multi} = this;
    const result: IEntity = {
      provide,
      deps: [...deps],
      useValue
    };
    if (multi)
      result.multi = multi;
    return result;
  }

}
