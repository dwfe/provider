import {Registry} from '../registry'

export class Provider {

  private registry = new Registry();

  get<TResult = any>(provide: any): TResult | undefined {
    const entries = this.registry.get(provide);
    if (!entries)
      return;
    for (const entry of entries) {
      let {deps} = entry;
      switch (entry.result) {
        case 'value':
          return entry.useValue;
        case 'class-instance':
          const useClass = entry.useClass as any;
          if (!deps) {
            // TODO взять из metadata
            deps = [];
          }
          return new useClass(...deps) as TResult;
        // return instance;
        case 'factory-result':
          return (entry.useFactory as Function)();
      }
    }

  }

}
