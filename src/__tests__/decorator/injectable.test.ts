import {describe} from '@jest/globals'
import 'reflect-metadata';
import {getMetadata} from '../../provider/getMetadata'
import {IProviderMetadata} from '../../provider'
import {injectable} from '../../decorator'
import {User} from '../abc/user'

//region Support

export function checkMetadata(target: object, testProvider: IProviderMetadata, testDesign: any[]) {
  const {designParamtypes, providerMetadata} = getMetadata(target);
  expect(testDesign.length).toBe(designParamtypes.length);
  for (let i = 0; i < testDesign.length; i++) {
    expect(designParamtypes[i]).toBe(testDesign[i]);
  }
  expect(Object.keys(testProvider).length).toBe(Object.keys(providerMetadata).length);
  for (const key of Object.keys(testProvider)) {
    expect(providerMetadata).toHaveProperty(key, testProvider[key]);
  }
}

//endregion Support

describe('Decorator.injectable', () => {

  test('predefined provider metadata + design:paramtypes', () => {
    @injectable()
    class A1 {
      constructor() {
      }
    }

    checkMetadata(A1, {}, []);
  });

  test('set "isOnlyOne" + design:paramtypes', () => {
    @injectable({isOnlyOne: true})
    class A2 {
      constructor(public name: string, private user: User) {
      }
    }

    checkMetadata(A2, {isOnlyOne: true}, [String, User]);
  });

});
