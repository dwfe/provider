import {Type} from '@do-while-for-each/common'

export interface IEntry<TProvide = any> {
  provide: TProvide;
  useClass?: Type<any>;
  useFactory?: Function;
  deps?: any;
  useValue?: any;
  multi?: boolean;
}
