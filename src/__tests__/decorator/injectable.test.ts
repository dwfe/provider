import {isEqual} from '@do-while-for-each/common'
import {describe} from '@jest/globals'
import 'reflect-metadata';
import {getMetadata} from '../../provider/getMetadata'
import {IProviderMetadata} from '../../provider'
import {injectable} from '../../decorator'
import {User} from '../abc/user'

//region Support

export function checkMetadata(target: object, testProvider: IProviderMetadata, testDesign: any[]) {
  const {designParamtypes, providerMetadata} = getMetadata(target);
  expect(isEqual(testDesign, designParamtypes)).toBe(true);
  expect(isEqual(testProvider, providerMetadata)).toBe(true);
}

@injectable()
class A1 {
  constructor() {
  }
}

@injectable({isOnlyOne: true})
class A2 {
  constructor(public name: string, private user: User) {
  }
}

//endregion Support

describe('Decorator.injectable', () => {

  test('predefined provider metadata + design:paramtypes', () => {
    checkMetadata(A1, {}, []);
  });

  test('set "isOnlyOne" + design:paramtypes', () => {
    checkMetadata(A2, {isOnlyOne: true}, [String, User]);
  });

});
