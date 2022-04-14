import {Type} from '@do-while-for-each/common';

export function single() {
  return (target: Type<any>) => {
    return target;
  };
}
