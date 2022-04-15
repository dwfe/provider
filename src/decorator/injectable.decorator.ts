import {Type} from '@do-while-for-each/common'
import {globalProvider} from '../provider'
import {IDecoratorOpt} from './contract'

export function injectable({multi}: IDecoratorOpt = {multi: false}) {
  return (target: Type<any>) => {
    const deps = Reflect.getMetadata('design:paramtypes', target); // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
    globalProvider.register({provide: target, deps, multi});
    return target;
  };
}
