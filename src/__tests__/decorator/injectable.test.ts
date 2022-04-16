import {describe} from '@jest/globals'
import 'reflect-metadata';
import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../../provider'
import {injectable} from '../../decorator'
import {User} from '../abc/user'

//region Support

function metadata(target: any): { designParamtypes: any[]; providerMetadata: IProviderMetadata } {
  return {
    designParamtypes: Reflect.getMetadata('design:paramtypes', target) || [], // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
    providerMetadata: Reflect.getMetadata(PROVIDER_METADATA_KEY, target),
  }
}

export function checkMetadata(target: object, testProvider: IProviderMetadata, testDesign: any[]) {
  const {designParamtypes, providerMetadata} = metadata(target);
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
