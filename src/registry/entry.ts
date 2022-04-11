import {Type} from '@do-while-for-each/common'
import {ifArraysEqual, isFunction} from './util'
import {IEntry} from './contract'

export class Entry<T = any> implements IEntry {
  readonly provide: T;  // !!any
  readonly useClass?: Type<any>;  // undefined || constructor
  readonly useFactory?: Function; // undefined || function
  readonly deps?: any[]; // undefined | any[]
  readonly useValue?: any; // undefined | any
  readonly multi: boolean; // false | true

  readonly expected!: 'value' | 'instance' | 'factory-result';

  constructor(entry: IEntry) {
    /**
     * Normalization & Validation
     */
    const {provide, useClass, useFactory, deps, useValue, multi} = entry;
    if (!provide) {
      console.error(`Incorrect provide:`, entry)
      throw new Error('');
    }
    this.provide = provide;
    if (useValue === undefined) {
      if (!!useClass && !!useFactory) {
        console.error(`At the same time, you can set either only useClass or only useFactory`, entry);
        throw new Error('');
      }
      if (useClass || !useFactory) {
        if (!!useClass && typeof useClass !== 'function') {
          console.error(`Incorrect useClass:`, entry);
          throw new Error('');
        }
        this.useClass = useClass;
        if (!this.useClass && isFunction(this.provide))
          this.useClass = this.provide as unknown as Type<any>;
        this.expected = 'instance';
      } else if (useFactory) {
        if (typeof useFactory !== 'function') {
          console.error(`Incorrect useFactory:`, entry);
          throw new Error('');
        }
        this.useFactory = useFactory;
        this.expected = 'factory-result';
      }
      if (deps === null || !!deps && !Array.isArray(deps)) {
        console.error(`Incorrect deps:`, entry);
        throw new Error('');
      }
      this.deps = deps;
    } else {
      this.useValue = useValue;
      this.expected = 'value';
    }
    this.multi = !!multi || false;
    if (!this.expected) {
      console.error(`The expected result is undefined`, entry)
      throw new Error('');
    }
  }

  equals({provide, useClass, useFactory, deps, useValue, multi}: Entry): boolean {
    if (this.provide !== provide)
      return false;
    if (this.useClass !== useClass)
      return false;
    if (this.useFactory !== useFactory)
      return false;
    if (!ifArraysEqual(this.deps, deps))
      return false;
    if (this.useValue !== useValue)
      return false;
    return this.multi === multi;
  }

  get base(): IEntry<T> {
    const {provide, useClass, useFactory, deps, useValue, multi} = this;
    const result: IEntry = {provide};
    if (useClass !== undefined)
      result.useClass = useClass;
    if (useFactory !== undefined)
      result.useFactory = useFactory;
    if (deps !== undefined)
      result.deps = deps;
    if (useValue !== undefined)
      result.useValue = useValue;
    if (multi !== undefined)
      result.multi = multi;
    return result;
  }

}
