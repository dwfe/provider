import {Type} from '@do-while-for-each/common'

export interface ITemplate {
  provide: any;
  useClass?: Type<any>;
  useFactory?: Function;
  deps?: any[];
  multi?: boolean;
}

export interface IValue {
  provide: any;
  deps?: any[];
  useValue: any;
  multi?: boolean;
}

export type Entry = ITemplate | IValue;
