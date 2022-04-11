import {Registry} from '../registry'

export class Provider {

  private registry = new Registry();

  get(provide: any) {
    const entries = this.registry.get(provide);
    if (!entries)
      return;
    for (const entry of entries) {
      switch (entry.expected) {
        case 'value':
          return entry.useValue;
        case 'instance':
          return new Map();
        case 'factory-result':
          return (entry.useFactory as Function)();
      }
    }

  }

}
