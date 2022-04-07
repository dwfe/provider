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

new Map<TProvider, any[]>([
  [
    {provide: Duck, useClass: Duck}, []
  ],
  [
    {provide: Duck, deps: ['quack!']}, []
  ]
])
