import {Type} from '@do-while-for-each/common'

export interface IEntry<T = any> {
  provide: T;
  useClass?: Type<any>;
  useFactory?: Function;
  deps?: any[];
  useValue?: any;
  multi?: boolean;
}
