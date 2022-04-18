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

//endregion Support

describe('Decorator.injectable', () => {

  test('has metadata', () => {
    @injectable()
    class A {
    }

    const {hasDesignParamtypes, hasProviderMetadata} = getMetadata(A);
    expect(hasDesignParamtypes).toBe(false);
    expect(hasProviderMetadata).toBe(true);
  });

  test('has metadata #2', () => {
    @injectable()
    class A {
      constructor(public name: string) {
      }
    }

    const {hasDesignParamtypes, hasProviderMetadata} = getMetadata(A);
    expect(hasDesignParamtypes).toBe(true);
    expect(hasProviderMetadata).toBe(true);
  });

  test('predefined provider metadata + design:paramtypes', () => {
    @injectable()
    class A1 {
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
