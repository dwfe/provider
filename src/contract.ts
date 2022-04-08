import {Type} from '@do-while-for-each/common';

export type TEntry = ICommonEntry;

export interface ICommonEntry {
  provide: any;
  useClass?: Type<any>;
  deps?: any[];
  useValue?: any;
  multi?: boolean;
}

interface IBird {
  sound(): string;
}

class Duck implements IBird {
  constructor(public message = 'quack!') {
  }

  sound() {
    return this.message;
  }
}

class Turkey implements IBird {
  constructor(public message = 'ololo!') {
  }

  sound() {
    return this.message;
  }
}

/**
 * ==========
 *
 * ADD ENTRY
 *  .) если (isClass(provide) И !deps И !useClass) тогда useClass = provide
 *
 * ==========
 *
 * RESOLVE
 *  .) если useValue, то просто его вернуть, иначе
 *
 *  Резолв инстанса класса.
 *    - если useClass это класс
 *
 *   1) определить список параметров конструктора
 *     - из deps
 *     - из Reflect.hasOwnMetadata("design:paramtypes", constructor) -> Reflect.getOwnMetadata
 *   2) заполнить параметры конструктора
 *     - для deps просто передать в конструктор
 *     - иначе каждый из параметров сначала надо зарезолвить
 *
 *  Резолв токена.
 *
 *  ==========
 *
 */

[
  [{provide: Duck, useClass: Duck}, []],
  [{provide: Duck, useClass: Turkey}, []],

  [{provide: Duck, useClass: Duck, deps: ['quack!']}, []],
  [{provide: Duck, useClass: Turkey, deps: ['ololo!']}, []],
]


new Map<any, TEntry[]>([
  [Duck, [{provide: Duck, useClass: Duck}]],
  [Turkey, [{provide: Turkey, useClass: Duck, deps: ['ololo!']}]],
  ['IBird', [
    {provide: 'IBird', useClass: Duck, multi: true},
    {provide: 'IBird', useClass: Turkey, multi: true},
  ]],
])
