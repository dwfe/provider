import {Type} from '@do-while-for-each/common';

export type TProvider = ICommonProvider;

export interface ICommonProvider {
  provide: any;
  useClass?: Type<any>;
  deps?: any[];
}
