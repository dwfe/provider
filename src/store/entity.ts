import {IEntity} from './contract';

export class Entity implements IEntity {
  readonly base: any;   // constructor | function
  readonly deps: any[]; // params for base
  readonly value: any;

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

  // equals(entity: Entity): boolean {
  //   return false;
  // }

}
