import {Type} from '@do-while-for-each/common'
import {arraysEqualStrictCheck} from '../util'
import {IEntity} from './contract';

export class Entity implements IEntity {
  readonly base: Type<any>; // constructor
  readonly deps: any[]; // params for instance of base
  readonly value: any; // instance

  constructor(entity: IEntity) {
    const {base, deps, value} = entity;
    if (!base) {
      console.error(`Prop "base" must be set:`, entity);
      throw new Error('Incorrect base');
    }
    this.base = base;
    if (!!deps && !Array.isArray(deps)) {
      console.error(`Prop "deps" if set, then it must be an array:`, entity);
      throw new Error('Incorrect deps');
    }
    this.deps = deps || [];
    if (value === undefined) {
      console.error(`Prop "value" must be set:`, entity);
      throw new Error('Incorrect value');
    }
    this.value = value;
  }

  equals({base, deps}: Entity): boolean {
    if (this.base !== base)
      return false;
    return arraysEqualStrictCheck(this.deps, deps);
  }

  get orig(): IEntity {
    return {
      base: this.base,
      deps: [...this.deps],
      value: this.value,
    };
  }

}
