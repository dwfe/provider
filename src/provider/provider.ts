import {Registry} from '../registry'

export class Provider {

  private registry = new Registry();

  get(provide: any) {
    const entries = this.registry.get(provide);
    if (!entries)
      return;
    for (const entry of entries) {
      switch (entry.result) {
        case 'value':
          return entry.useValue;
        case 'class-instance':

        // return instance;
        case 'factory-result':
          return (entry.useFactory as Function)();
      }
    }

  }

}
