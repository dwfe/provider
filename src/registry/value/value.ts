import {arraysEqualStrictCheck} from '../../util'
import {IValue} from '../contract';

export class Value implements IValue {
  readonly provide: any;
  readonly useValue: any;
  readonly deps: any[];
  readonly multi: boolean;

  constructor(value: IValue) {
    const {provide, deps, useValue, multi} = value;

    if (!provide) {
      console.error(`Prop "provide" must be set:`, value);
      throw new Error('Incorrect provide');
    }
    this.provide = provide;

    if (useValue === undefined) {
      console.error(`Prop "useValue" must be set:`, value);
      throw new Error('Incorrect useValue');
    }
    this.useValue = useValue;

    if (!!deps && !Array.isArray(deps)) {
      console.error(`Prop "deps" if set, then it must be an array:`, value);
      throw new Error('Incorrect deps');
    }
    this.deps = deps || [];

    this.multi = !!multi || false;
  }

  equals({provide, deps}: Value): boolean {
    if (this.provide !== provide)
      return false;
    return arraysEqualStrictCheck(this.deps, deps);
  }

  get orig(): IValue {
    const {provide, deps, useValue, multi} = this;
    const result: IValue = {
      provide,
      useValue,
    };
    if (deps.length)
      result.deps = [...deps];
    if (multi)
      result.multi = multi;
    return result;
  }

}
