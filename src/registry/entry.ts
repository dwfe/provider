import {Type} from '@do-while-for-each/common'
import {IEntry} from './contract'

export class Entry implements IEntry {
  provide: any;
  useClass?: Type<any>;
  deps: any[];
  useValue?: any;
  multi: boolean;

  isClassProvided = false;
  isValueProvided = false;

  constructor({provide, useClass, deps, useValue, multi}: IEntry) {
    this.provide = provide;
    this.useClass = useClass;
    this.deps = Array.isArray(deps) ? deps : [];
    this.useValue = useValue;
    this.multi = !!multi || false;
    this.determineWhatProvided();
    if (!this.useClass && this.isClassProvided)
      this.useClass = this.provide;
  }

  private determineWhatProvided() {
    if (this.useValue === undefined) {
      if (typeof this.provide === 'function') {
        this.isValueProvided = false;
        this.isClassProvided = true;
      } else
        throw new Error('Need to determine what is being provided');
    } else {
      this.isValueProvided = true;
      this.isClassProvided = false;
    }
  }

}
