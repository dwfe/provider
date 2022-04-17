import {describe} from '@jest/globals'
import 'reflect-metadata';
import {inject, injectable, single} from '../../decorator'
import {checkMetadata} from './injectable.test'
import {Provider} from '../../provider'

//region Support


//endregion Support

describe('Decorator.inject', () => {

  test('@injectable', () => {
    @injectable()
    class A1 {
      constructor() {
      }
    }

    @injectable()
    class A2 {
      constructor(public id = 90,
                  public a1: A1,
                  @inject('hello') public name = 'Naruto',
                  public type: boolean) {
      }
    }

    checkMetadata(A1, {}, []);
    checkMetadata(A2, {ctorParams: {[2]: 'hello'}}, [Object, A1, Object, Boolean]);
    const a2 = Provider.of().getOnlyOne<A2>(A2);
    expect(a2).toBeInstanceOf(A2);
    expect(a2).toHaveProperty('name', 'hello');
    expect(a2.a1).toBeInstanceOf(A1);
    expect(a2).toHaveProperty('id', 90);
    expect(a2).toHaveProperty('type', undefined);
  });

  test('@single', () => {
    @single
    class A1 {
      constructor() {
      }
    }

    @single
    class A2 {
      constructor(public id = 90,
                  public a1: A1,
                  @inject('hello') public name = 'Naruto',
                  public type: boolean) {
      }
    }

    checkMetadata(A1, {isOnlyOne: true}, []);
    checkMetadata(A2, {isOnlyOne: true, ctorParams: {[2]: 'hello'}}, [Object, A1, Object, Boolean]);
    const a2 = Provider.of().getOnlyOne<A2>(A2);
    expect(a2).toBeInstanceOf(A2);
    expect(a2).toHaveProperty('name', 'hello');
    expect(a2.a1).toBeInstanceOf(A1);
    expect(a2).toHaveProperty('id', 90);
    expect(a2).toHaveProperty('type', undefined);
  });

  test('inject multi', () => {
    //todo
  });

});
