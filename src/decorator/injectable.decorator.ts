import {Type} from '@do-while-for-each/common'

export function injectable() {
  return (target: Type<any>) => {
    return target;
  };
}
