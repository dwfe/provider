import {isPrimitive, Type} from '@do-while-for-each/common'
import {arraysEqualStrictCheck, isFunction} from '../util'
import {IEntry} from './contract'

/**
 * Entry types:
 *  Template -> { provide, useClass?, useFactory?, deps?, multi? }
 *  Value    -> { provide, useValue, multi? }
 */
export class Entry implements IEntry {

  readonly provide: any;  // !!any
  readonly useClass?: Type<any>;  // undefined || constructor
  readonly useFactory?: Function; // undefined || function
  readonly useValue?: any; // undefined | any
  readonly deps?: any[]; // undefined | any[]
  readonly multi: boolean; // false | true

  constructor(data: IEntry) {
    const {provide, useClass, useFactory, useValue, deps, multi} = data;
    /**
     * Normalization & Validation
     */
    if (provide == null) { // undefined, null
      console.error(`Incorrect "provide":`, data);
      throw new Error(`Incorrect "provide"`);
    }
    if (isPrimitive(provide)
      && useClass === undefined
      && useFactory === undefined
      && useValue === undefined) {
      console.error(`If "provide" is a primitive, then one of the following must be set: useClass, useFactory, useValue.`, data);
      throw new Error(`Incorrect entry when "provide" is a primitive`);
    }
    this.provide = provide;

    if (useValue === undefined) {
      if (!!useClass && !!useFactory) {
        console.error(`At the same time, you can set either "useClass" or "useFactory":`, data);
        throw new Error(`Only one: "useClass" or "useFactory"`);
      }
      if (useFactory) {
        if (typeof useFactory !== 'function') {
          console.error(`Incorrect "useFactory":`, data);
          throw new Error(`Incorrect "useFactory"`);
        }
        this.useFactory = useFactory;
      } else { // if (useClass || !useFactory)
        if (!!useClass && typeof useClass !== 'function') {
          console.error(`Incorrect "useClass":`, data);
          throw new Error(`Incorrect "useClass"`);
        }
        this.useClass = useClass;
        if (!this.useClass && isFunction(this.provide))
          this.useClass = this.provide as unknown as Type<any>;
      }

      if (deps === null || !!deps && !Array.isArray(deps)) {
        console.error(`Incorrect "deps":`, data);
        throw new Error(`Incorrect "deps"`);
      }
      this.deps = deps || [];
    } else {
      this.useValue = useValue;
    }
    this.multi = !!multi || false;
  }

  equals({provide, useClass, useFactory, useValue, deps, multi}: Entry): boolean {
    if (this.provide !== provide)
      return false;
    if (this.useClass !== useClass)
      return false;
    if (this.useFactory !== useFactory)
      return false;
    if (this.useValue !== useValue)
      return false;
    if (!arraysEqualStrictCheck(this.deps, deps))
      return false;
    return this.multi === multi;
  }

  get orig(): IEntry {
    const {provide, useClass, useFactory, deps, multi, useValue} = this;
    const result: IEntry = {
      provide,
    };
    if (useValue === undefined) {
      if (useClass)
        result.useClass = useClass;
      if (useFactory)
        result.useFactory = useFactory;
      if (deps)
        result.deps = [...deps];
    } else {
      result.useValue = useValue;
    }
    if (multi)
      result.multi = multi;
    return result;
  }

}
