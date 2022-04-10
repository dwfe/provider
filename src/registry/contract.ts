import {Type} from '@do-while-for-each/common'

export interface IEntry {
  provide: any;
  useClass?: Type<any>;
  useFactory?: Function;
  deps?: any[];
  useValue?: any;
  multi?: boolean;
}
