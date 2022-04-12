import {Registry} from '../registry'
import {Store} from '../store';

export class Provider {

  private registry = new Registry();
  private store = new Store();

  get(provide: any) {
    const entries = this.registry.get(provide);
    if (!entries)
      return;
    for (const entry of entries) {
      switch (entry.expected) {
        case 'value':
          return entry.useValue;
        case 'instance':
          const instance = new Map();
          if ('singleton')
            this.store.set({base: entry.useClass, deps: entry.deps, value: instance});
          return instance;
        case 'factory-result':
          return (entry.useFactory as Function)();
      }
    }

  }

}
