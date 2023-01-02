import {IClassConstructor} from '@do-while-for-each/common'

export interface IEntry {
  provide: any;
  useClass?: IClassConstructor<any>;
  useFactory?: Function;
  useValue?: any;
  deps?: any[];
  multi?: boolean;
}
