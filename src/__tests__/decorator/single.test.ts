import {describe} from '@jest/globals'
import {checkMetadata} from './injectable.test'
import {single} from '../../decorator'
import {User} from '../abc/user'

describe('Decorator', () => {

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

  test('', () => {

  });

});
