import {describe} from '@jest/globals'
import {getMetadata} from '../../provider/getMetadata';
import {checkMetadata} from './injectable.test'
import {single} from '../../decorator'
import {User} from '../abc/user'

describe('Decorator', () => {

  test('has metadata', () => {
    @single
    class A {
    }

    const {hasDesignParamtypes, hasProviderMetadata} = getMetadata(A);
    expect(hasDesignParamtypes).toBe(false);
    expect(hasProviderMetadata).toBe(true);
  });

  test('has metadata #2', () => {
    @single
    class A {
      constructor(public name: string) {
      }
    }

    const {hasDesignParamtypes, hasProviderMetadata} = getMetadata(A);
    expect(hasDesignParamtypes).toBe(true);
    expect(hasProviderMetadata).toBe(true);
  });

  test('predefined provider metadata + design:paramtypes', () => {
    @single
    class A1 {
      constructor() {
      }
    }

    checkMetadata(A1, {isOnlyOne: true}, []);

    @single
    class A2 {
      constructor(public name: string, private user: User) {
      }
    }

    checkMetadata(A2, {isOnlyOne: true}, [String, User]);
  });

});
