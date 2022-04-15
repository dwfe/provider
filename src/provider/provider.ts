import {Registry} from '../registry'

export class Provider {

  private registry = new Registry();

  get<TResult = any>(provide: any, deps?: any[]): TResult | undefined {
    const entries = this.registry.get(provide, deps);
    if (!entries)
      return;
    for (const entry of entries) {
      if (entry.result === 'value')
        return entry.useValue;

      let deps: any[] = [];
      if (!entry.deps) {
        // TODO взять из metadata
        deps = deps.map(x => this.get(x));
      }
      switch (entry.result) {
        case 'class-instance':
          const useClass = entry.useClass as any;
          return new useClass(...deps) as TResult;
        case 'factory-result':
          return (entry.useFactory as Function)();
        default:
          throw new Error(`Unknown entry result "${entry.result}"`);
      }
    }

  }

}
