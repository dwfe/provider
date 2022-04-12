import {arraysEqualStrictCheck} from '../util';
import {IEntity} from './contract';
import {Entity} from './entity';

export class Store {

  private map = new Map<any, Entity[]>();

  get<TValue>(identity: { base: any; deps?: any[] }): TValue | undefined {
    const existed = this.map.get(identity.base);
    if (!existed)
      return;
    const entity = existed.find(x => arraysEqualStrictCheck(x.deps, identity.deps));
    return entity?.value;
  }

  set(data: Entity | IEntity) {
    const entity = data instanceof Entity ? data : new Entity(data);
    const {base} = entity;
    this.map.set(base, [entity]);
  }

}
