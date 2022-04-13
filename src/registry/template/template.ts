import {isPrimitive, Type} from '@do-while-for-each/common'
import {arraysEqualFailCheck, isFunction} from '../../util'
import {ITemplate} from '../contract'

export class Template implements ITemplate {
  readonly provide: any;  // !!any
  readonly useClass?: Type<any>;  // undefined || constructor
  readonly useFactory?: Function; // undefined || function
  readonly deps?: any[]; // undefined | any[]
  readonly multi: boolean; // false | true

  readonly expected: 'instance' | 'factory-result';

  constructor(template: ITemplate) {
    const {provide, useClass, useFactory, deps, multi} = template;
    /**
     * Normalization & Validation
     */
    if (provide == null) { // undefined, null
      console.error(`Incorrect "provide":`, template);
      throw new Error(`Incorrect "provide"`);
    }
    if (isPrimitive(provide)
      && useClass === undefined
      && useFactory === undefined) {
      console.error(`If "provide" is a primitive, then one of the following must be set: useClass, useFactory.`, template);
      throw new Error(`Incorrect template with primitive type of "provide"`);
    }
    this.provide = provide;

    if (!!useClass && !!useFactory) {
      console.error(`At the same time, you can set either "useClass" or "useFactory":`, template);
      throw new Error(`Only one: "useClass" or "useFactory"`);
    }
    if (useFactory) {
      if (typeof useFactory !== 'function') {
        console.error(`Incorrect "useFactory":`, template);
        throw new Error(`Incorrect "useFactory"`);
      }
      this.useFactory = useFactory;
      this.expected = 'factory-result';
    } else { // if (useClass || !useFactory)
      if (!!useClass && typeof useClass !== 'function') {
        console.error(`Incorrect "useClass":`, template);
        throw new Error(`Incorrect "useClass"`);
      }
      this.useClass = useClass;
      if (!this.useClass && isFunction(this.provide))
        this.useClass = this.provide as unknown as Type<any>;
      this.expected = 'instance';
    }
    if (deps === null || !!deps && !Array.isArray(deps)) {
      console.error(`Incorrect "deps":`, template);
      throw new Error(`Incorrect "deps"`);
    }
    this.deps = deps;
    if (!!deps && deps.length === 0)
      this.deps = undefined;

    this.multi = !!multi || false;
  }

  equals({provide, useClass, useFactory, deps, multi}: Template): boolean {
    if (this.provide !== provide)
      return false;
    if (this.useClass !== useClass)
      return false;
    if (this.useFactory !== useFactory)
      return false;
    if (!arraysEqualFailCheck(this.deps, deps))
      return false;
    return this.multi === multi;
  }

  get orig(): ITemplate {
    const {provide, useClass, useFactory, deps, multi} = this;
    const result: ITemplate = {provide};
    if (useClass !== undefined)
      result.useClass = useClass;
    if (useFactory !== undefined)
      result.useFactory = useFactory;
    if (deps !== undefined)
      result.deps = [...deps];
    if (multi)
      result.multi = multi;
    return result;
  }

}
