import {Type} from '@do-while-for-each/common'
import {arraysEqual} from './util'
import {IEntry} from './contract'

export class Entry<T = any> implements IEntry {
  readonly provide: T;  // !!any
  readonly useClass?: Type<any>; // constructor
  readonly deps?: any[]; // undefined | any[]
  readonly useValue?: any; // undefined | any
  readonly multi: boolean; // false | true

  readonly isClassProvided: boolean;
  readonly isValueProvided: boolean;

  constructor(entry: IEntry) {
    /**
     * Normalization
     */
    const {provide, useClass, deps, useValue, multi} = entry;
    if (!provide) {
      console.error(`Incorrect provide:`, entry)
      throw new Error('');
    }
    this.provide = provide;
    if (useClass === null || !!useClass && typeof useClass !== 'function') {
      console.error(`Incorrect useClass:`, entry);
      throw new Error('');
    }
    this.useClass = useClass;
    if (deps === null || !!deps && !Array.isArray(deps)) {
      console.error(`Incorrect deps:`, entry);
      throw new Error('');
    }
    this.deps = deps;
    this.useValue = useValue;
    this.multi = !!multi || false;

    /**
     * What is provided?
     */
    if (this.useValue === undefined) {
      if (typeof this.provide === 'function') {
        this.isValueProvided = false;
        this.isClassProvided = true;
      } else {
        console.error(`Need to determine what is being provided:`, entry)
        throw new Error('');
      }
    } else {
      this.isValueProvided = true;
      this.isClassProvided = false;
    }

    /**
     * Normalization
     */
    if (!this.useClass && this.isClassProvided)
      this.useClass = this.provide as unknown as Type<any>;
  }

  equals({provide, useClass, deps, useValue, multi}: Entry): boolean {
    if (this.provide !== provide)
      return false;
    if (this.useClass !== useClass)
      return false;

    const aIsArr = Array.isArray(this.deps);
    const bIsArr = Array.isArray(deps);
    if (aIsArr && bIsArr) {
      if (!arraysEqual(this.deps as any[], deps))
        return false;
    } else if (aIsArr || bIsArr)
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
