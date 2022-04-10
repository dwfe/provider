import {Type} from '@do-while-for-each/common'
import {ifArraysCheckEqual, isFunction} from './util'
import {IEntry} from './contract'

export class Entry<T = any> implements IEntry {
  readonly provide: T;  // !!any
  readonly useClass?: Type<any>; // constructor
  readonly deps?: any[]; // undefined | any[]
  readonly useValue?: any; // undefined | any
  readonly multi: boolean; // false | true

  readonly isValueProvided: boolean;
  readonly isClassProvided: boolean;

  constructor(entry: IEntry) {
    this.isValueProvided = false;
    this.isClassProvided = false;
    /**
     * Normalization
     */
    const {provide, useClass, deps, useValue, multi} = entry;
    if (!provide) {
      console.error(`Incorrect provide:`, entry)
      throw new Error('');
    }
    this.provide = provide;
    if (useValue === undefined) {
      this.isClassProvided = true;
      if (useClass === null || !!useClass && typeof useClass !== 'function') {
        console.error(`Incorrect useClass:`, entry);
        throw new Error('');
      }
      this.useClass = useClass;
      if (this.useClass === undefined && isFunction(this.provide))
        this.useClass = this.provide as unknown as Type<any>;
      if (deps === null || !!deps && !Array.isArray(deps)) {
        console.error(`Incorrect deps:`, entry);
        throw new Error('');
      }
      this.deps = deps;
    } else {
      this.useValue = useValue;
      this.isValueProvided = true;
    }
    this.multi = !!multi || false;
  }

  equals({provide, useClass, deps, useValue, multi}: Entry): boolean {
    if (this.provide !== provide)
      return false;
    if (this.useClass !== useClass)
      return false;
    if (!ifArraysCheckEqual(this.deps, deps))
      return false;
    if (this.useValue !== useValue)
      return false;
    return this.multi === multi;
  }

  toSimple(): IEntry {
    return {
      provide: this.provide,
      useClass: this.useClass,
      deps: this.deps,
      useValue: this.useValue,
      multi: this.multi,
    }
  }

}
