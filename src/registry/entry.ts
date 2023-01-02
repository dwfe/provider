import {isPrimitive, IClassConstructor} from '@do-while-for-each/common'
import {arraysEqualFailCheck, isFunction} from '../util'
import {IEntry} from './contract'

/**
 *
 * Entry result types:
 *
 *  1. Value creator:
 *      class-instance = { provide, useClass?, deps?, multi? }
 *      factory-result = { provide, useFactory, deps?, multi? }
 *
 *  2. Ready value:
 *     { provide, useValue, multi? }
 *
 */
export class Entry implements IEntry {

  readonly provide: any;  // any except [null, undefined]
  readonly useClass?: IClassConstructor<any>;  // constructor
  readonly useFactory?: Function; // function
  readonly useValue?: any; // any except [undefined]
  readonly deps?: any[]; // non-empty any[]
  readonly multi: boolean; // false | true

  readonly result: 'class-instance' | 'factory-result' | 'value';

  constructor(data: IEntry) {
    const {provide, useClass, useFactory, useValue, deps, multi} = data;
    /**
     * Normalization & Validation
     */
    if (provide == null) { // null, undefined
      console.error('Incorrect "provide":', data);
      throw new Error('Incorrect "provide"');
    }
    if (isPrimitive(provide)
      && useClass === undefined
      && useFactory === undefined
      && useValue === undefined) {
      console.error('If "provide" is a primitive, then one of the following must be set: useClass, useFactory, useValue.', data);
      throw new Error('Incorrect entry when "provide" is a primitive');
    }
    this.provide = provide;

    if (useValue === undefined) {
      if (useClass && useFactory) {
        console.error('At the same time, you can set either "useClass" or "useFactory":', data);
        throw new Error('Only one: "useClass" or "useFactory"');
      }
      if (useFactory) {
        if (!isFunction(useFactory)) {
          console.error('"useFactory" must be a function:', data);
          throw new Error('Incorrect "useFactory"');
        }
        this.useFactory = useFactory;
        this.result = 'factory-result';
      } else {
        if (useClass && !isFunction(useClass)) {
          console.error('Incorrect "useClass":', data);
          throw new Error('Incorrect "useClass"');
        }
        this.useClass = useClass;
        if (!this.useClass) {
          if (!isFunction(this.provide)) {
            console.error('Incorrect "provide". Must be a function:', data);
            throw new Error('Incorrect "provide". Must be a function');
          }
          this.useClass = this.provide as unknown as IClassConstructor<any>;
        }
        this.result = 'class-instance';
      }

      if (deps === null || deps && !Array.isArray(deps)) {
        console.error('Incorrect "deps":', data);
        throw new Error('Incorrect "deps"');
      }
      this.deps = deps;
      if (deps && deps.length === 0)
        this.deps = undefined;
    } else {
      this.useValue = useValue;
      this.result = 'value';
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
    if (!arraysEqualFailCheck(this.deps, deps))
      return false;
    return this.multi === multi;
  }

  clone(): Entry {
    return new Entry({
      ...this,
      deps: this.deps ? [...this.deps] : this.deps,
    })
  }

  get orig(): IEntry {
    const {provide, useClass, useFactory, useValue, deps, multi} = this;
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
