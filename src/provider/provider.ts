import {guid, isPrimitive} from '@do-while-for-each/common';
import {IEntry, Registry} from '../registry'
import {IProviderGetOpt} from './contract';
import {ROOT_PROVIDER_ID} from './index'

export class Provider {

  private registry = new Registry();

  constructor(public readonly id: string) {
  }

  static of(data: IEntry[] = [], id = guid()): Provider {
    const provider = new Provider(id);
    provider.register(...data);
    return provider;
  }

  register(...data: IEntry[]): void {
    for (const entry of data)
      this.registry.set(entry);
  }

  getOnlyOne<TValue = any>(provide: any, opt: IProviderGetOpt = {}): TValue {
    const value = this.getAll<TValue>(provide, opt);
    if (value === undefined || Array.isArray(value)) {
      console.error('provide:', provide, 'The value is not the only one:', value);
      throw new Error('The value is not the only one');
    }
    return value;
  }

  getAll<TValue = any>(provide: any, opt: IProviderGetOpt = {}): TValue | TValue[] | undefined {
    const entries = this.registry.get(provide, opt.deps);
    if (!entries) {
      if (opt.primitiveCanBeResult && isPrimitive(provide))
        return provide;
      console.warn('provide:', provide, `Missing from the provider's registry`);
      return;
    }
    const result: TValue[] = [];
    for (const entry of entries) {
      if (entry.result === 'value')
        return entry.useValue;

      let deps: any[] = entry.deps || [];
      if (deps.length) {
        // TODO взять из metadata
        deps = deps.map(x =>
          this.getAll(x, {primitiveCanBeResult: true})
        );
      }
      switch (entry.result) {
        case 'class-instance':
          result.push(new (entry.useClass as any)(...deps) as TValue);
          break;
        case 'factory-result':
          result.push((entry.useFactory as Function)(...deps) as TValue);
          break;
        default:
          throw new Error(`Unknown entry result "${entry.result}"`);
      }
    }
    switch (result.length) {
      case 0:
        return;
      case 1:
        return result[0];
      default:
        return result;
    }
  }

}

const rootProvider = new Provider(ROOT_PROVIDER_ID);
export {
  rootProvider
};
