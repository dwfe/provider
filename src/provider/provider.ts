import {guid, isPrimitive, isPrimitiveTypeWrapper} from '@do-while-for-each/common';
import {IEntry, Registry} from '../registry'
import {getMetadata} from './getMetadata'
import {ROOT_PROVIDER_ID} from './index'

export class Provider {

  private registry = new Registry();

  constructor(public readonly id = guid()) {
  }

  static of(data: IEntry[] = [], id?: string): Provider {
    const provider = new Provider(id);
    provider.register(...data);
    return provider;
  }

  register(...data: IEntry[]): void {
    for (const entry of data)
      this.registry.set(entry);
  }

  private registerByMetadata(provide: any): void {
    if (this.registry.has(provide))
      return;
    const {designParamtypes, providerMetadata} = getMetadata(provide);
    const ctorParamsMetadata = providerMetadata.ctorParams || {};
    const deps: any[] = designParamtypes.map((dep, index) => {
      const injected = ctorParamsMetadata[index];
      dep = injected === undefined ? dep : injected;
      if (!this.registry.has(dep)) {
        if (
          isPrimitive(dep) ||
          /**
           * E.g. with decorator use:
           *   @injectable class A{constructor(public: name: string){}}
           * dep for prop "name" will have the value: String.
           * Bad idea to put it to the registry.
           */
          isPrimitiveTypeWrapper(dep)
        ) {
          return dep;
        }
        /**
         * E.g. with decorator use:
         *   @injectable class A{constructor(public: name = 'Alex'){}}
         * dep for prop "name" will have the value: Object.
         */
        if (dep === Object) {
          return undefined;
        }
      }
      if (!this.registry.get(dep, isPrimitive(dep) ? undefined : getMetadata(dep).designParamtypes))
        this.registerByMetadata(dep);
      return dep;
    });
    if (providerMetadata.isOnlyOne)
      this.register({provide, useValue: new provide(...this.valuesByDeps(deps))});
    else
      this.register({provide, useClass: provide, deps});
  }

  getOnlyOne<TValue = any>(provide: any, deps?: any[]): TValue {
    const value = this.getAll<TValue>(provide, deps);
    if (value === undefined || Array.isArray(value)) {
      console.error('provide:', provide, '. The value is not the only one:', value);
      throw new Error('The value is not the only one');
    }
    return value;
  }

  getAll<TValue = any>(provide: any, deps?: any[]): TValue | TValue[] | undefined {
    const entries = this.registry.get(provide, deps);

    if (!entries) {
      if (!isPrimitive(provide)) {
        this.registerByMetadata(provide);
        return this.getAll(provide, deps);
      }
      console.warn('provide:', provide, `Missing from the provider's registry`);
      return;
    }

    const result: TValue[] = [];
    for (const entry of entries) {

      if (entry.result === 'value') {
        result.push(entry.useValue);
        continue;
      }

      const deps = entry.deps || [];
      const valuesByDeps = deps.length ? this.valuesByDeps(deps) : [];
      switch (entry.result) {
        case 'class-instance':
          result.push(new (entry.useClass as any)(...valuesByDeps) as TValue);
          break;
        case 'factory-result':
          result.push((entry.useFactory as Function)(...valuesByDeps) as TValue);
          break;
        default:
          throw new Error(`Unknown entry result "${entry.result}"`);
      }
    }
    if (entries.some(x => x.multi))
      return result;
    switch (result.length) {
      case 0:
        return;
      case 1:
        return result[0];
      default:
        return result;
    }
  }

  private valuesByDeps(deps: any[]): any[] {
    return deps.map(dep => {
      if (!this.registry.has(dep)) {
        /**
         * E.g. with manual registration:
         *   {provide: User, deps: ['John']}
         * when
         *   {provide: 'John', ...}
         * is not registered in the registry.
         *
         * As a result, the instance will be created like this:
         *   new User('John')
         */
        if (isPrimitive(dep))
          return dep;

        /**
         * E.g. with decorator use:
         *   @injectable class A{constructor(public: name: string){}}
         */
        if (isPrimitiveTypeWrapper(dep))
          return undefined;
      }
      const value = this.getAll(dep);
      if (Array.isArray(value) && value.length === 1)
        return value[0];
      return value;
    });
  }

}

const provider = new Provider(ROOT_PROVIDER_ID);
export {
  provider,
};
