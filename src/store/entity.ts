import {IEntity} from './contract';

export class Entity<TBase = any> implements IEntity<TBase> {
  readonly base: TBase;
  readonly deps: any[];
  readonly value: any;

  constructor(entity: IEntity) {
    this.base = entity.base;
    this.deps = [...entity.deps];
    this.value = entity.value;
  }

  equals(entity: Entity): boolean {
    return false;
  }

}
