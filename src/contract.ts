import {Type} from '@do-while-for-each/common';

export type TProvider = ICommonEntry;

export interface ICommonEntry {
  provide: any;
  useClass?: Type<any>;
  deps?: any[];
}

class Duck {
  constructor(public message?: string) {
  }
}

class Turkey {
  constructor(public message?: string) {
  }
}

// 1) Add Entry

new Map<TProvider, any[]>([
  [{provide: Duck, useClass: Duck}, []],
  [{provide: Duck, useClass: Turkey}, []],

  [{provide: Duck, deps: ['quack!']}, []],
  [{provide: Duck, useClass: Turkey, deps: ['ololo!']}, []],
])
