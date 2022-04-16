import {describe} from '@jest/globals'
import {ROOT_PROVIDER_ID} from '../../provider'
import {checkMetadata} from './injectable.test'
import {single} from '../../decorator'
import {User} from '../abc/user'

describe('Decorator', () => {

  test('predefined provider metadata + design:paramtypes', () => {
    @single()
    class A1 {
      constructor() {
      }
    }

    checkMetadata(A1, {providerId: ROOT_PROVIDER_ID, isOnlyOne: true}, []);
  });

  test('override providerId + design:paramtypes', () => {
    @single('platform')
    class A2 {
      constructor(public name: string, private user: User) {
      }
    }

    checkMetadata(A2, {providerId: 'platform', isOnlyOne: true}, [String, User]);
  });

});
