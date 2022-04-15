import {Type} from '@do-while-for-each/common';
import {globalProvider} from '../provider'

export function single() {
  return (target: Type<any>) => {
    const deps = Reflect.getMetadata('design:paramtypes', target); // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
    console.log(``,deps)
    globalProvider.register({provide: target, useValue: 123});
    return target;
  };
}
