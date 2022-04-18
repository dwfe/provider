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

  private registerByMetadata(provide: any): boolean {
    if (this.registry.has(provide))
      return true;
    const {hasDesignParamtypes, designParamtypes, hasProviderMetadata, providerMetadata} = getMetadata(provide);
    if (!hasDesignParamtypes && !hasProviderMetadata)
      return false;
    const ctorParamsMetadata = providerMetadata.ctorParams || {};
    const deps = designParamtypes.map((dep, index) => {
      const injected = ctorParamsMetadata[index];
      dep = injected === undefined ? dep : injected; // replace dep with the injected value
      if (!this.registry.has(dep)) {
        if (
          /**
           * E.g. when the replacement occurred:
           *   @injectable class A{constructor(@inject('Birds') public: user: User){}}
           * dep for prop "name" will have the value: String.
           * Bad idea to put it to the registry.
           */
          isPrimitive(dep) ||

          /**
           * E.g.:
           *   @injectable class A{constructor(public: name: string){}}
           * dep for prop "name" will have the value: String.
           * Bad idea to put it to the registry.
           */
          isPrimitiveTypeWrapper(dep)
        ) {
          return dep;
        }
        /**
         * The default value of any type is converted to dep as Object.
         * E.g.:
         *   @injectable class A{constructor(public: name = 'Alex'){}}
         * dep for prop "name" will have the value: Object.
         */
        if (dep === Object) {
          return undefined;
        }
      }
      if (!this.registry.get(dep, isPrimitive(dep) ? undefined : getMetadata(dep).designParamtypes)) {
        const isRegistered = this.registerByMetadata(dep);
        if (!isRegistered) {
          console.error('provide:', dep, `. Missing from the provider's registry. The "provide" must be registered either manually or using decorators.`);
          throw new Error('Unregistered "provide" [dep]');
        }
      }
      return dep;
    });
    if (providerMetadata.isOnlyOne)
      this.register({provide, useValue: new provide(...this.valuesByDeps(deps))});
    else
      this.register({provide, useClass: provide, deps});
    return true;
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
      if (isPrimitive(provide)) {
        console.error('provide:', provide, `. Missing from the provider's registry. The "provide" must be registered either manually or using decorators.`);
        throw new Error('Unregistered "provide" [primitive type]');
      } else {
        const isRegistered = this.registerByMetadata(provide);
        if (isRegistered)
          return this.getAll(provide, deps);
        console.error('provide:', provide, `. Missing from the provider's registry. The "provide" must be registered either manually or using decorators.`);
        throw new Error('Unregistered "provide" [non-primitive type]');
      }
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
          throw new Error(`Unknown entry result type "${entry.result}"`);
      }
    }
    if (result.length === 1 && !entries[0].multi)
      return result[0];
    return result;
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
         * Don't know what to inject.
         */
        if (isPrimitiveTypeWrapper(dep))
          return undefined;
      }
      const value = this.getAll(dep);
      if (Array.isArray(value)) {
        if (this.registry.get(dep)?.some(x => x.multi))
          return value;
        if (value.length === 1)
          return value[0];
      }
      return value;
    });
  }

}

const provider = new Provider(ROOT_PROVIDER_ID);
export {
  provider,
};
