import {isPrimitive} from '@do-while-for-each/common';
import {IEntry, Registry} from '../registry'
import {IProviderGetOpt} from './contract';

export class Provider {

  private registry = new Registry();

  set(...data: IEntry[]): void {
    for (const entry of data)
      this.registry.set(entry);
  }

  /**
   * Get a result guaranteed to consist of a single value.
   */
  single<TResult = any>(provide: any, opt: IProviderGetOpt = {}): TResult {
    const result = this.get<TResult>(provide, opt);
    if (result === undefined || Array.isArray(result)) {
      console.error('provide:', provide, 'The result is not a single one:', result);
      throw new Error('The result is not a single one');
    }
    return result;
  }

  get<TResult = any>(provide: any, opt: IProviderGetOpt = {}): TResult | TResult[] | undefined {
    const entries = this.registry.get(provide, opt.deps);
    if (!entries) {
      if (opt.primitiveCanBeResult && isPrimitive(provide))
        return provide;
      console.warn('provide:', provide, `Missing from the provider's registry`);
      return;
    }
    const result = [];
    for (const entry of entries) {
      if (entry.result === 'value')
        return entry.useValue;

      let deps: any[] = entry.deps || [];
      if (deps.length) {
        // TODO взять из metadata
        deps = deps.map(x =>
          this.get(x, {primitiveCanBeResult: true})
        );
      }
      switch (entry.result) {
        case 'class-instance':
          result.push(new (entry.useClass as any)(...deps) as TResult);
          break;
        case 'factory-result':
          result.push((entry.useFactory as Function)(...deps) as TResult);
          break;
        default:
          throw new Error(`Unknown entry result "${entry.result}"`);
      }
    }
    switch (result.length) {
      case 0:
        return undefined;
      case 1:
        return result[0];
      default:
        return result;
    }
  }

}
