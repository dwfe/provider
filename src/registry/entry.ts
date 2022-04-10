import {Type} from '@do-while-for-each/common'
import {ifArraysCheckEqual, isFunction} from './util'
import {IEntry} from './contract'

export class Entry<T = any> implements IEntry {
  readonly provide: T;  // !!any
  readonly useClass?: Type<any>;  // undefined || constructor
  readonly useFactory?: Function; // undefined || function
  readonly deps?: any[]; // undefined | any[]
  readonly useValue?: any; // undefined | any
  readonly multi: boolean; // false | true

  readonly isValueProvided: boolean;
  readonly isClassInstanceProvided: boolean;
  readonly isFactoryResultProvided: boolean;

  constructor(entry: IEntry) {
    this.isValueProvided = false;
    this.isClassInstanceProvided = false;
    this.isFactoryResultProvided = false;
    /**
     * Validation & Normalization
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
        this.isClassInstanceProvided = true;
      } else if (useFactory) {
        if (typeof useFactory !== 'function') {
          console.error(`Incorrect useFactory:`, entry);
          throw new Error('');
        }
        this.useFactory = useFactory;
        this.isFactoryResultProvided = true;
      }
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
