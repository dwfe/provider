import {Type} from '@do-while-for-each/common';

export type TProvider = ICommonEntry;

export interface ICommonEntry {
  provide: any;
  useClass?: Type<any>;
  deps?: any[];
  useValue?: any;
}

class Duck {
  constructor(public message?: string) {
  }
}

class Turkey {
  constructor(public message?: string) {
  }
}

/**
 * ADD ENTRY
 *  .)
 *
 * RESOLVE
 *  .) если useValue, то просто его вернуть, иначе
 *
 *  Резолв инстанса класса.
 *   1) определить список параметров конструктора
 *     - из deps
 *     - из Reflect.hasOwnMetadata("design:paramtypes", constructor) -> Reflect.getOwnMetadata
 *   2) заполнить параметры конструктора
 *     - для deps просто передать в конструктор
 *     - иначе каждый из параметров сначала надо зарезолвить
 *
 */

new Map<TProvider, any[]>([
  [{provide: Duck, useClass: Duck}, []],
  [{provide: Duck, useClass: Turkey}, []],

  [{provide: Duck, deps: ['quack!']}, []],
  [{provide: Duck, useClass: Turkey, deps: ['ololo!']}, []],
])
