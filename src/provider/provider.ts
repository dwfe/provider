import {Registry} from '../registry'

export class Provider {

  private registry = new Registry();

  get<TResult = any>(provide: any, deps?: any[]): TResult | TResult[] | undefined {
    const entries = this.registry.get(provide, deps);
    if (!entries)
      return;
    const result = [];
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
