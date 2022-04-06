import {Type} from '@do-while-for-each/common';

type TProvider = Type<any>|ClassProvider|ConstructorProvider;

export interface ClassProvider {
  provide: any;
  useClass: Type<any>;
}

export interface ConstructorProvider {
  provide: Type<any>;
  deps?: any[];
}
