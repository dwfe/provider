import {Type} from '@do-while-for-each/common'

export interface IEntry {
  provide: any;
  useClass?: Type<any>;
  useFactory?: Function;
  deps?: any[];
  multi?: boolean;
}

export interface IEntity {
  provide: any;
  deps?: any[];
  useValue: any;
  multi?: boolean;
}
