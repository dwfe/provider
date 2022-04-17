import {describe} from '@jest/globals'
import 'reflect-metadata';
import {inject, injectable} from '../../decorator'
import {provider} from '../../provider'

//region Support

@injectable()
class A1 {
  constructor() {
  }
}

@injectable({isOnlyOne: true})
class A2 {
  constructor(@inject('hello') public name: string,
              private a2: A2) {
  }
}

//endregion Support

describe('Decorator.inject', () => {

  test('', () => {
    // provider.getAll()
    // checkMetadata(A1, {}, []);
  });

});
