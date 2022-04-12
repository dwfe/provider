import {Type} from '@do-while-for-each/common'
import {arraysEqualStrictCheck} from '../util';
import {IEntity, IIdentity} from './contract';
import {Entity} from './entity';

export class Store {

  private map = new Map<Type<any>, Entity[]>();

  get<TValue>(identity: IIdentity): TValue | undefined {
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
